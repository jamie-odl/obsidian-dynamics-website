import json
import os
import urllib.parse
import urllib.request


STRIPE_API = "https://api.stripe.com/v1"

PLANS = [
    ("PRICE_SKYGRID_STARTER", "SkyGrid Starter", 75000),
    ("PRICE_SKYGRID_PROFESSIONAL", "SkyGrid Professional", 175000),
    ("PRICE_SKYGRID_ENTERPRISE", "SkyGrid Enterprise", 400000),
]


def stripe_request(method, path, key, form=None):
    url = STRIPE_API + path
    data = None
    headers = {"Authorization": f"Bearer {key}"}
    if form is not None:
        data = urllib.parse.urlencode(form).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def create_product_and_price(key, name, unit_amount):
    product = stripe_request("POST", "/products", key, form={"name": name})
    price = stripe_request(
        "POST",
        "/prices",
        key,
        form={
            "product": product["id"],
            "currency": "gbp",
            "unit_amount": str(unit_amount),
            "recurring[interval]": "month",
        },
    )
    return product["id"], price["id"]


def main():
    stripe_key = os.environ.get("STRIPE_SECRET_KEY")
    if not stripe_key:
        raise RuntimeError("STRIPE_SECRET_KEY is required")

    out = {}
    for env_key, name, amount in PLANS:
        _, price_id = create_product_and_price(stripe_key, name, amount)
        out[env_key] = price_id

    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
