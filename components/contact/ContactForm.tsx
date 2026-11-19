"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { validateContact, type ContactErrors, type ContactValues } from "@/lib/contact-validation";

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const submitting = useRef(false);
  const submissionId = useRef<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const { values, errors: nextErrors } = validateContact(Object.fromEntries(formData));
    setErrors(nextErrors);
    setFeedback("");
    setStatus("idle");
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("sending");
    try {
      submissionId.current ??= typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) =>
            (Number(character) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(character) / 4)))).toString(16)
          );
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionId.current },
        body: JSON.stringify({ ...values, website: formData.get("website") ?? "" }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json() as { success?: boolean; errors?: ContactErrors; error?: string };
      if (!response.ok || result.success !== true) {
        if (result.errors) {
          setErrors(result.errors);
          const field = Object.keys(result.errors)[0];
          (form.elements.namedItem(field) as HTMLElement | null)?.focus();
        }
        setStatus("error");
        setFeedback(result.error || "Please check the highlighted fields and try again.");
        return;
      }
      form.reset();
      submissionId.current = null;
      setStatus("success");
      setFeedback("Thank you for reaching out! Your message has been sent. I'll get back to you as soon as I can.");
    } catch {
      setStatus("error");
      setFeedback("We couldn't confirm your message was sent. Please check your connection and try again.");
    } finally {
      submitting.current = false;
    }
  };

  const validateField = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as keyof ContactValues;
    const form = event.currentTarget.form;
    if (!form) return;
    const { errors: nextErrors } = validateContact(Object.fromEntries(new FormData(form)));
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };
  const clearField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as keyof ContactValues;
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setFeedback("");
  };
  const fieldClassName = "w-full min-w-0 rounded-xl border border-line bg-surface px-3.5 py-2 text-base text-foreground outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-muted focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-red-500 disabled:opacity-60";
  const errorMessage = (field: keyof ContactValues) => (
    <div className={`grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none ${errors[field] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
      <div className="overflow-hidden"><p id={`contact-${field}-error`} className="pt-2 text-sm text-red-500" aria-live="polite">{errors[field]}</p></div>
    </div>
  );
  const fieldProps = (field: keyof ContactValues) => ({
    onBlur: validateField, onChange: clearField, disabled: status === "sending",
    "aria-invalid": Boolean(errors[field]), "aria-describedby": `contact-${field}-error`,
  });

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "sending"} className=" flex w-full max-w-xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div> 
        <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-foreground">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120} placeholder="Your name" className={fieldClassName} {...fieldProps("name")} />
        {errorMessage("name")}
       </div>
      <div> 
        <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-foreground">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className={fieldClassName} {...fieldProps("email")} />
        {errorMessage("email")}
      </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-foreground">Message</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={5} placeholder="Write your message here..." className={`${fieldClassName} resize-y`} {...fieldProps("message")} />
        {errorMessage("message")}
      </div>
      <div hidden aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-8 py-3 font-semibold text-bg transition-[background-color,opacity] duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 sm:w-auto">
          {status === "sending" ? "Sending..." : "Send message"} <ArrowUpRight aria-hidden="true" className="ml-2 size-4 shrink-0" />
        </button>
        <div className={`grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none ${feedback ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden"><p role="status" aria-live="polite" aria-atomic="true" className={`break-words pt-4 text-sm leading-6 ${status === "error" ? "text-red-500" : "text-foreground"}`}>{feedback}</p></div>
        </div>
      </div>
    </form>
  );
}
