import { createHash } from "node:crypto";
import { validateContact } from "@/lib/contact-validation";
import { createContactEmails } from "@/lib/contact-emails";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url);
  const host = request.headers.get("host") ?? requestOrigin.host;
  if (origin && origin !== `${requestOrigin.protocol}//${host}`) {
    return Response.json({ error: "Please submit the form from this website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Please submit a valid form." }, { status: 415 });
  }
  let body;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 20000) {
      return Response.json({ error: "Your message is too long." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Please submit a valid form." }, { status: 400 });
  }
  const { values, errors } = validateContact(body);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });
  if (typeof body.website !== "string" || body.website) {
    return Response.json({ error: "Unable to submit this form." }, { status: 400 });
  }
  const submissionId = request.headers.get("idempotency-key");
  if (!submissionId || !/^[a-f0-9-]{36}$/i.test(submissionId)) {
    return Response.json({ error: "Please refresh the page and try again." }, { status: 400 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "Email is temporarily unavailable. Please try again later." }, { status: 503 });
  }
  try {
    const payload = JSON.stringify(createContactEmails(values, from));
    const digest = createHash("sha256").update(payload).digest("hex");
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact-${submissionId}-${digest}`,
      },
      body: payload,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const providerError = await response.json().catch(() => null) as { name?: unknown } | null;
      console.error("Contact email request failed:", response.status, typeof providerError?.name === "string" ? providerError.name : "unknown");
      if (response.status === 403) {
        return Response.json({ error: "Email sending is not configured yet. Please contact me by email while I fix this." }, { status: 503 });
      }
      return Response.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "We couldn't confirm your message was sent. Please retry." }, { status: 502 });
  }
}
