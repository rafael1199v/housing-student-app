import environmentConfiguration from "../configuration/environment.mjs";
import { EnumMessageType } from "../enums/message-type.mjs";
import { buildConfirmationEmailTemplateHtml } from "../email-templates/confirmation-email-template.mjs";
import { validateMessage } from "../validators/message-validator.mjs";


export const EmailService = {
    async sendEmail(message) {
        const validatedMessage = validateMessage(message);
        const res = await fetch(environmentConfiguration.RESEND_EMAILS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${environmentConfiguration.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: environmentConfiguration.RESEND_FROM_EMAIL,
              to: [validatedMessage.to],
              subject: validatedMessage.subject,
              html: this.selectHtmlBuilder(validatedMessage)
            }),
          });

        if(!res.ok) 
            throw Error(`Email sending failed with status ${res.status}`);

        return res.json();
    },

    selectHtmlBuilder(message) {
        switch(message.type) {
            case EnumMessageType.ConfirmationEmail:
                return buildConfirmationEmailTemplateHtml(message.firstName, message.confirmationLink);
            default:
                throw Error(`Email type ${message.type} is not supported`)
        }
    }
}


