import { EnumMessageType } from "../enums/message-type.mjs"

export function validateMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    throw new Error("SQS message body must be a JSON object");
  }

  const requiredFields = ["type", "to", "firstName", "confirmationLink", "subject"];

  for (const field of requiredFields) {
    if (typeof message[field] !== "string" || !message[field].trim()) {
      throw new Error(`Invalid or missing field: ${field}`);
    }
  }

  if (!Object.values(EnumMessageType).includes(message.type)) {
    throw new Error(`Unsupported message type: ${message.type}`);
  }

  if (!message.to.includes("@")) {
    throw new Error("Invalid recipient email");
  }

  let confirmationUrl;
  try {
    confirmationUrl = new URL(message.confirmationLink);
  } catch {
    throw new Error("Invalid confirmationLink URL");
  }

  if (!["https:", "http:"].includes(confirmationUrl.protocol)) {
    throw new Error("confirmationLink must use HTTP or HTTPS");
  }

  return {
    type: message.type,
    subject: message.subject.trim(),
    to: message.to.trim(),
    firstName: message.firstName.trim(),
    confirmationLink: confirmationUrl.toString(),
  };
}