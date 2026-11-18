# Contact email setup

The contact form uses Resend's HTTP API; no extra packages are required.

Set these server-only variables in `.env.local` and your hosting environment:

```dotenv
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Jyotii <jyoti.kumari174315@mail.com>"
```

The sender above was supplied for this project. Resend must verify its domain before it can send to visitors. A regular mail.com mailbox does not give you control of mail.com's DNS. If you cannot verify that domain, replace this value with an address on a domain you own and verify in Resend. Never prefix the API key with NEXT_PUBLIC_. Restart the server after changing environment variables.

Enquiries go to `Jyoti.kumari174315@gmail.com`, with the visitor as Reply-To. A separate thank-you email goes to the visitor, with Jyotii's Gmail as Reply-To. HTML and plain-text templates are in `lib/contact-emails.ts`. Both messages are submitted in one Resend batch. Success means Resend accepted the request, not guaranteed inbox delivery; check the Resend dashboard for delivery or bounces.

Validation runs in both the browser and API. Failed submissions retain the entered values. Retries reuse an idempotency key, protecting against duplicate sends when a response is lost. The hidden website field is a basic spam trap, not comprehensive bot protection; use your hosting provider's rate limiting for a public deployment if needed.

Deploy with a Next.js server/runtime supporting route handlers. Test live delivery after setting valid credentials and a verified sender: submit an enquiry, check both inboxes and Reply-To addresses, then review delivery in Resend.

References: https://resend.com/docs/api-reference/emails/send-batch-emails and https://resend.com/docs/dashboard/domains/introduction
