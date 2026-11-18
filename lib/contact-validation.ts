export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(input: unknown): { values: ContactValues; errors: ContactErrors } {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const value = (key: string) => typeof source[key] === "string" ? source[key].trim() : "";
  const values = { name: value("name"), email: value("email"), message: value("message") };
  const errors: ContactErrors = {};
  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > 120 || /[\r\n]/.test(values.name)) errors.name = "Please use a name of 120 characters or fewer on one line.";
  if (!values.email) errors.email = "Please enter your email address.";
  else if (values.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 10) errors.message = "Please write a message of at least 10 characters.";
  else if (values.message.length > 3000) errors.message = "Please keep your message within 3,000 characters.";
  return { values, errors };
}
