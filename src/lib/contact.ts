export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = { name: 100, message: 5000, minMessage: 10 } as const;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "Name is too long.";

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please write a message.";
  else if (message.length < CONTACT_LIMITS.minMessage)
    errors.message = `Message should be at least ${CONTACT_LIMITS.minMessage} characters.`;
  else if (message.length > CONTACT_LIMITS.message) errors.message = "Message is too long.";

  return errors;
}

interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

/**
 * Sends via the EmailJS REST API directly — no SDK needed. Template params keep
 * the field names the existing EmailJS template expects.
 */
export async function sendContactMessage(
  input: ContactInput,
  config: EmailJsConfig,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: {
        user_name: input.name.trim(),
        user_email: input.email.trim(),
        message: input.message.trim(),
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`EmailJS responded with ${res.status}`);
  }
}
