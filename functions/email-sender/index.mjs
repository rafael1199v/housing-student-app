import { EmailService } from "./services/email-service.mjs";
import { validateMessage } from "./validators/message-validator.mjs";

export const handler = async (event) => {
  const logger = console;
  const batchItemFailures = [];

  if (!Array.isArray(event?.Records) || event.Records.length === 0) {
    throw new Error("Expected at least one SQS record");
  }

  for (const record of event.Records ?? []) {
    const messageId = record.messageId ?? "unknown";
    logger.info("Processing confirmation email", { messageId });

    try {
      const message = JSON.parse(record.body);

      logger.info("Message content: ", message);
      
      const validatedMessage = validateMessage(message);
      logger.info(message);
      await EmailService.sendEmail(message);

      logger.info("Confirmation email sent", {
        messageId
      });

    } catch (error) {
      logger.error("Confirmation email failed", {
        messageId,
        error: error instanceof Error ? error.message : String(error),
      });
      
      batchItemFailures.push({ itemIdentifier: messageId });
    }
  }

  return { batchItemFailures };
};
