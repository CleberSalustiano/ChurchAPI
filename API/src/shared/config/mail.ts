const smtpPort = Number(process.env.SMTP_PORT || 587);

const mailConfig = {
  from: process.env.MAIL_FROM || "no-reply@churchapi.local",
  exposeResetTokenInResponse:
    process.env.EXPOSE_RESET_TOKEN_IN_RESPONSE === "true",
  passwordResetUrlBase:
    process.env.PASSWORD_RESET_URL_BASE || "http://localhost:3000/reset-password",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number.isNaN(smtpPort) ? 587 : smtpPort,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
};

export default mailConfig;
