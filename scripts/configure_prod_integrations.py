import json
import os
import secrets
import urllib.request
import urllib.error


def request_json(method, url, headers=None, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        raise RuntimeError(f"{method} {url} failed: {e.code} {body}")


def ensure_resend_domain(domain, resend_key):
    headers = {"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"}
    _, domains = request_json("GET", "https://api.resend.com/domains", headers=headers)
    existing = next((d for d in domains.get("data", []) if d.get("name") == domain), None)
    if existing:
        domain_id = existing["id"]
    else:
        _, created = request_json(
            "POST",
            "https://api.resend.com/domains",
            headers=headers,
            payload={"name": domain},
        )
        domain_id = created["id"]
    _, details = request_json("GET", f"https://api.resend.com/domains/{domain_id}", headers=headers)
    return details


def relative_name(full_name, root_domain):
    name = full_name.rstrip(".")
    root = root_domain.rstrip(".")
    if name == root:
        return "@"
    suffix = "." + root
    if name.endswith(suffix):
        rel = name[: -len(suffix)]
        return rel if rel else "@"
    return name


def upsert_godaddy_record(domain, key, secret, rec_type, name, value, ttl=600):
    auth = f"sso-key {key}:{secret}"
    url = f"https://api.godaddy.com/v1/domains/{domain}/records/{rec_type}/{name}"
    headers = {"Authorization": auth, "Content-Type": "application/json"}
    payload = [{"data": value, "ttl": ttl}]
    request_json("PUT", url, headers=headers, payload=payload)


def sync_dns_from_resend(domain, godaddy_key, godaddy_secret, resend_domain_details):
    records = resend_domain_details.get("records", [])
    for rec in records:
        typ = rec.get("record")
        name = rec.get("name")
        value = rec.get("value")
        if not typ or not name or value is None:
            continue
        rel_name = relative_name(name, domain)
        upsert_godaddy_record(domain, godaddy_key, godaddy_secret, typ, rel_name, value, ttl=600)

    # Ensure DMARC baseline exists.
    dmarc_value = "v=DMARC1; p=none; rua=mailto:security@" + domain
    upsert_godaddy_record(domain, godaddy_key, godaddy_secret, "TXT", "_dmarc", dmarc_value, ttl=600)


def vercel_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def upsert_vercel_env(project_id, team_id, token, key, value):
    headers = vercel_headers(token)
    list_url = f"https://api.vercel.com/v9/projects/{project_id}/env?teamId={team_id}"
    _, existing = request_json("GET", list_url, headers=headers)
    for env in existing.get("envs", []):
        if env.get("key") == key and "production" in env.get("target", []):
            env_id = env["id"]
            del_url = f"https://api.vercel.com/v9/projects/{project_id}/env/{env_id}?teamId={team_id}"
            request_json("DELETE", del_url, headers=headers)

    create_url = f"https://api.vercel.com/v10/projects/{project_id}/env?teamId={team_id}"
    payload = {
        "key": key,
        "value": value,
        "type": "encrypted",
        "target": ["production"],
    }
    request_json("POST", create_url, headers=headers, payload=payload)


def main():
    domain = os.environ["OD_DOMAIN"]
    resend_key = os.environ["RESEND_API_KEY"]
    godaddy_key = os.environ["GODADDY_KEY"]
    godaddy_secret = os.environ["GODADDY_SECRET"]
    vercel_token = os.environ["VERCEL_TOKEN"]
    vercel_project_id = os.environ["VERCEL_PROJECT_ID"]
    vercel_team_id = os.environ["VERCEL_TEAM_ID"]
    stripe_secret = os.environ["STRIPE_SECRET_KEY"]

    resend_domain_details = {"id": None, "records": []}
    skip_dns = os.environ.get("SKIP_DNS_SYNC", "").lower() == "true"
    if not skip_dns:
        resend_domain_details = ensure_resend_domain(domain, resend_key)
        sync_dns_from_resend(domain, godaddy_key, godaddy_secret, resend_domain_details)

    auth_secret = secrets.token_urlsafe(48)
    success_url = f"https://{domain}/billing.html?status=success"
    cancel_url = f"https://{domain}/billing.html?status=cancel"
    portal_return = f"https://{domain}/account-operations.html"

    envs = {
        "RESEND_API_KEY": resend_key,
        "STRIPE_SECRET_KEY": stripe_secret,
        "AUTH_TOKEN_SECRET": auth_secret,
        "DEVELOPER_ALLOWLIST": "jamie@projectskygrid.com",
        "AUTH_EMAIL_FROM": f"security@{domain}",
        "NODE_ENV": "production",
        "BILLING_SUCCESS_URL": success_url,
        "BILLING_CANCEL_URL": cancel_url,
        "BILLING_PORTAL_RETURN_URL": portal_return,
    }
    for key, value in envs.items():
        upsert_vercel_env(vercel_project_id, vercel_team_id, vercel_token, key, value)

    print(json.dumps({
        "domain": domain,
        "resend_domain_id": resend_domain_details.get("id"),
        "dns_records_synced": len(resend_domain_details.get("records", [])),
        "vercel_envs_upserted": list(envs.keys()),
        "note": "Stripe price ID env vars still need to be set once provided."
    }, indent=2))


if __name__ == "__main__":
    main()
