const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "084810b3af3f1a",
    pass: "32fe0f253f664e",
  },
});

const mailtemplates = {
  reset: {
    subject: "Password Reset",
    text: "Here is your password reset url.\n[url]",
  },
};

const constructTemplate = (type, config) => {
  Object.keys(config).reduce(
    (acc, key) => acc.text.replace(`[${key}]`, config[key]),
    mailtemplates[type]
  );
};

const sendmail = async ({ email, type, ...config }) => {
  const template = constructTemplate(type, config);
  await transport.sendMail({
    to: email,
    from: "techchat@admin.com",
    subject: template.subject,
    text: template.text,
  });
};

module.exports = { sendmail };
