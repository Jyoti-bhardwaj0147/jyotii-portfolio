import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requireDependency = createRequire(import.meta.url);

// Compile only the local modules under test using the project's existing TypeScript.
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiledModule = { exports: {} };
  cache.set(filename, compiledModule);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  const localRequire = (name) => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return requireDependency(name);
    const base = name.startsWith("@/") ? path.resolve(__dirname, "..", name.slice(2)) : path.resolve(path.dirname(filename), name);
    const file = [base, `${base}.ts`, `${base}.tsx`].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
    return load(path.relative(path.resolve(__dirname, ".."), file));
  };
  vm.runInThisContext(`(function(require, module, exports) { ${source}\n})`, { filename })(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const { validateContact } = load("lib/contact-validation.ts");
const { createContactEmails } = load("lib/contact-emails.ts");
const { POST } = load("app/api/contact/route.ts");
const valid = { name: " Visitor ", email: "visitor@example.com", message: "A project enquiry for you.", website: "" };
const request = (body = valid, headers = {}) => new Request("https://portfolio.test/api/contact", {
  method: "POST", headers: { "content-type": "application/json", "idempotency-key": "12345678-1234-1234-1234-123456789abc", ...headers }, body: JSON.stringify(body),
});

test("contact validation trims values and rejects missing, malformed and oversized fields", () => {
  assert.equal(validateContact(valid).values.name, "Visitor");
  assert.deepEqual(validateContact(valid).errors, {});
  assert.equal(Object.keys(validateContact(null).errors).length, 3);
  for (const input of [{ name: " " }, { name: "a".repeat(121) }, { name: "Name\nInjected" }, { email: "broken@" }, { email: "a\nb@example.com" }, { message: "short" }, { message: "x".repeat(3001) }]) {
    assert.ok(Object.keys(validateContact({ ...valid, ...input }).errors).length);
  }
});

test("templates escape HTML, route enquiries and thank-you replies correctly", () => {
  const emails = createContactEmails({ ...valid, name: '<img src=x onerror="x">', message: "<script>alert(1)</script>" }, "sender@example.com");
  assert.equal(emails.length, 2);
  assert.deepEqual(emails[0].to, ["Jyoti.kumari174315@gmail.com"]);
  assert.equal(emails[0].reply_to, valid.email);
  assert.deepEqual(emails[1].to, [valid.email]);
  assert.equal(emails[1].reply_to, "Jyoti.kumari174315@gmail.com");
  for (const email of emails) {
    assert.ok(!email.html.includes("<img"));
    assert.ok(!email.html.includes("<script>"));
    assert.ok(email.text.length > 0);
  }
});

test("API rejects invalid requests before sending", async () => {
  assert.equal((await POST(request({}))).status, 400);
  assert.equal((await POST(request({ ...valid, website: "spam" }))).status, 400);
  assert.equal((await POST(request(valid, { origin: "https://other.test" }))).status, 403);
  assert.equal((await POST(new Request("http://localhost:3000/api/contact", { method: "POST", headers: { origin: "http://192.168.1.16:3000", host: "192.168.1.16:3000", "content-type": "application/json", "idempotency-key": "bad" }, body: JSON.stringify(valid) }))).status, 400);
  assert.equal((await POST(request(valid, { origin: "http://other.test", host: "192.168.1.16:3000" }))).status, 403);
  assert.equal((await POST(request(valid, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await POST(request(valid, { "idempotency-key": "bad" }))).status, 400);
  assert.equal((await POST(request({ ...valid, message: "a".repeat(21000) }))).status, 413);
  assert.equal((await POST(new Request("https://portfolio.test/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).status, 400);
});

test("API handles missing configuration, acceptance, provider failure and network failure", async () => {
  const originalFetch = globalThis.fetch;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  try {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    assert.equal((await POST(request())).status, 503);
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM_EMAIL = "sender@example.com";
    const keys = [];
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails/batch");
      const emails = JSON.parse(options.body);
      assert.equal(emails.length, 2);
      assert.equal(options.headers.Authorization, "Bearer test-key");
      keys.push(options.headers["Idempotency-Key"]);
      return Response.json({ data: [{ id: "one" }, { id: "two" }] });
    };
    assert.deepEqual(await (await POST(request())).json(), { success: true });
    await POST(request());
    assert.equal(keys[0], keys[1]);
    await POST(request({ ...valid, message: "An edited project message." }));
    assert.notEqual(keys[0], keys[2]);
    globalThis.fetch = async () => Response.json({ message: "sensitive provider details" }, { status: 429 });
    const failure = await POST(request());
    assert.equal(failure.status, 502);
    assert.ok(!(await failure.text()).includes("sensitive"));
    globalThis.fetch = async () => Response.json({ name: "validation_error", message: "sender details" }, { status: 403 });
    const senderFailure = await POST(request());
    assert.equal(senderFailure.status, 503);
    assert.match((await senderFailure.json()).error, /not configured/);
    globalThis.fetch = async () => { throw new Error("Network down"); };
    assert.equal((await POST(request())).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (key === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = key;
    if (from === undefined) delete process.env.RESEND_FROM_EMAIL; else process.env.RESEND_FROM_EMAIL = from;
  }
});
