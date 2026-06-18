import { requireEnvironmentVariable } from "../utils/require-environment-variable.mjs";

const RESEND_API_KEY = requireEnvironmentVariable("RESEND_API_KEY", process.env);
const RESEND_EMAILS_URL = requireEnvironmentVariable("RESEND_EMAILS_URL", process.env);
const RESEND_FROM_EMAIL = requireEnvironmentVariable("RESEND_FROM_EMAIL", process.env);

export default {
    RESEND_API_KEY,
    RESEND_EMAILS_URL,
    RESEND_FROM_EMAIL
}