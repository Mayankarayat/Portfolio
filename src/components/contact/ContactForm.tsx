"use client";

import { useRef, useState, type FormEvent } from "react";
import { emailConfig } from "@/config/site";
import { CONTACT_LIMITS, sendContactMessage, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", maxLength: CONTACT_LIMITS.name, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 254, placeholder: "you@company.com" },
] as const;

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (String(data.get("company") ?? "")) return;

    const input: ContactInput = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const nextErrors = validateContact(input);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      await sendContactMessage(input, emailConfig, AbortSignal.timeout(15000));
      setStatus({ kind: "sent" });
      formRef.current?.reset();
    } catch {
      setStatus({ kind: "error", message: `Something went wrong. You can email me directly at ${fallbackEmail}.` });
    }
  }

  const sending = status.kind === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5" aria-describedby="contact-status">
      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={`contact-${field.name}`} className="mb-2 block text-sm font-medium">
              {field.label}
            </label>
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              required
              className="field"
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={errors[field.name] ? `contact-${field.name}-error` : undefined}
            />
            {errors[field.name] ? (
              <p id={`contact-${field.name}-error`} className="mt-2 text-sm text-danger">
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message}
          placeholder="Tell me about the role, the team or the project — and how I can help."
          className="field resize-y"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-2 text-sm text-danger">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending} className="btn btn-primary disabled:cursor-wait disabled:opacity-60">
          {sending ? "Sending…" : "Send message"}
        </button>
        <p
          id="contact-status"
          role="status"
          aria-live="polite"
          className={`text-sm ${status.kind === "error" ? "text-danger" : "text-success"}`}
        >
          {status.kind === "sent" ? "Thanks — your message is on its way. I'll get back to you soon." : null}
          {status.kind === "error" ? status.message : null}
        </p>
      </div>
    </form>
  );
}
