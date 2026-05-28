const fs = require('fs');
const path = require('path');

const root = __dirname;

function linkCheck() {
  const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  const hrefRe = /href="([^"]+)"/g;
  let hrefTotal = 0;
  let localChecked = 0;
  const missing = [];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    let match;
    while ((match = hrefRe.exec(content))) {
      hrefTotal += 1;
      const href = match[1];
      if (/^(https?:|mailto:|#|javascript:)/.test(href)) continue;
      localChecked += 1;
      const target = href.split('?')[0].split('#')[0];
      if (!target) continue;
      const targetPath = path.join(root, target);
      if (!fs.existsSync(targetPath)) missing.push({ file, href });
    }
  }

  return {
    htmlFiles: htmlFiles.length,
    hrefTotal,
    localChecked,
    missingCount: missing.length,
    missing: missing.slice(0, 40),
  };
}

function sitemapCheck() {
  const smPath = path.join(root, 'sitemap.xml');
  if (!fs.existsSync(smPath)) {
    return { ok: false, error: 'missing sitemap.xml', missingFiles: [] };
  }
  const xml = fs.readFileSync(smPath, 'utf8');
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const locs = [];
  let m;
  while ((m = locRe.exec(xml))) {
    locs.push(m[1].trim());
  }
  const missingFiles = [];
  for (const absUrl of locs) {
    let pathname;
    try {
      pathname = new URL(absUrl).pathname;
    } catch {
      missingFiles.push({ url: absUrl, reason: 'bad URL' });
      continue;
    }
    const slug = pathname === '/' ? 'index' : pathname.replace(/^\//, '').replace(/\.html$/, '');
    let filePath;
    if (slug.includes('/')) {
      filePath = path.join(root, slug + '.html');
    } else {
      const htmlName = slug === 'index' ? 'index.html' : `${slug}.html`;
      filePath = path.join(root, htmlName);
    }
    if (!fs.existsSync(filePath)) {
      missingFiles.push({ url: absUrl, expected: path.relative(root, filePath) });
    }
  }
  return {
    ok: missingFiles.length === 0,
    urlCount: locs.length,
    missingFiles: missingFiles.slice(0, 30),
  };
}

async function apiCheck() {
  const utils = require('./api/auth/_utils');
  const handlers = {
    requestLink: require('./api/auth/request-link'),
    verify: require('./api/auth/verify'),
    session: require('./api/auth/session'),
    logout: require('./api/auth/logout'),
  };

  const mkRes = () => {
    const state = {
      statusCode: 200,
      headers: {},
      body: null,
      redirectTo: null,
    };
    return {
      status(code) {
        state.statusCode = code;
        return this;
      },
      json(payload) {
        state.body = payload;
        return this;
      },
      send(payload) {
        state.body = payload;
        return this;
      },
      setHeader(key, value) {
        state.headers[key] = value;
      },
      redirect(code, location) {
        state.statusCode = code;
        state.redirectTo = location;
      },
      _state: state,
    };
  };

  process.env.AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'local-test-secret-123';
  process.env.DEVELOPER_ALLOWLIST = process.env.DEVELOPER_ALLOWLIST || 'jamie@obsidiandynamics.co.uk';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'dummy';
  process.env.AUTH_EMAIL_FROM = process.env.AUTH_EMAIL_FROM || 'security@example.com';

  global.fetch = async () => ({ ok: true, text: async () => 'ok' });

  // 1) request-link should deny unknown
  const reqDeny = { method: 'POST', body: { email: 'unknown@example.com', next: 'developer-central.html' }, headers: { host: 'localhost:3000', 'x-forwarded-proto': 'http' }, socket: { remoteAddress: '127.0.0.1' } };
  const resDeny = mkRes();
  await handlers.requestLink(reqDeny, resDeny);

  // 2) request-link should allow allowlisted
  const reqAllow = { method: 'POST', body: { email: 'jamie@obsidiandynamics.co.uk', next: 'developer-central.html' }, headers: { host: 'localhost:3000', 'x-forwarded-proto': 'http' }, socket: { remoteAddress: '127.0.0.1' } };
  const resAllow = mkRes();
  await handlers.requestLink(reqAllow, resAllow);

  // 3) session should reject no cookie
  const reqSessionNo = { method: 'GET', headers: {}, socket: { remoteAddress: '127.0.0.1' } };
  const resSessionNo = mkRes();
  await handlers.session(reqSessionNo, resSessionNo);

  // 4) verify should set session cookie and redirect
  const magicToken = utils.signToken({
    email: 'jamie@obsidiandynamics.co.uk',
    type: 'magic_link',
    next: 'developer-central.html',
    jti: 'test-jti-1',
  }, 15 * 60);
  const reqVerify = { method: 'GET', query: { token: magicToken }, headers: {}, socket: { remoteAddress: '127.0.0.1' } };
  const resVerify = mkRes();
  await handlers.verify(reqVerify, resVerify);
  const setCookie = resVerify._state.headers['Set-Cookie'] || '';

  // 5) replay token should fail
  const reqReplay = { method: 'GET', query: { token: magicToken }, headers: {}, socket: { remoteAddress: '127.0.0.1' } };
  const resReplay = mkRes();
  await handlers.verify(reqReplay, resReplay);

  // 6) session should pass with cookie
  const reqSessionYes = {
    method: 'GET',
    headers: { cookie: setCookie },
    socket: { remoteAddress: '127.0.0.1' },
  };
  const resSessionYes = mkRes();
  await handlers.session(reqSessionYes, resSessionYes);

  // 7) logout should clear cookie
  const reqLogout = { method: 'POST', headers: {}, socket: { remoteAddress: '127.0.0.1' } };
  const resLogout = mkRes();
  await handlers.logout(reqLogout, resLogout);

  return {
    requestLinkDeniedStatus: resDeny._state.statusCode,
    requestLinkAllowStatus: resAllow._state.statusCode,
    requestLinkAllowOk: Boolean(resAllow._state.body && resAllow._state.body.ok),
    sessionNoCookieStatus: resSessionNo._state.statusCode,
    verifyStatus: resVerify._state.statusCode,
    verifyRedirect: resVerify._state.redirectTo,
    replayStatus: resReplay._state.statusCode,
    sessionWithCookieStatus: resSessionYes._state.statusCode,
    logoutStatus: resLogout._state.statusCode,
    logoutSetCookiePresent: Boolean(resLogout._state.headers['Set-Cookie']),
  };
}

(async () => {
  const sm = sitemapCheck();
  const output = {
    linkCheck: linkCheck(),
    sitemapCheck: sm,
    apiCheck: await apiCheck(),
  };
  const exitBadLinks = output.linkCheck.missingCount > 0;
  const exitBadSitemap = !sm.ok;
  console.log(JSON.stringify(output, null, 2));
  if (exitBadLinks || exitBadSitemap) {
    process.exitCode = 1;
  }
})();
