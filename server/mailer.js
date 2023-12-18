const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailtemplates = {
  reset: {
    subject: "Password Reset",
    html: `
    Hi [username],

    You can reset your password using the link below.
    <a href="[url]">link</a>

    Thanks & Regards
    Tech-Chat Support`,
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
    html: template.text,
  });
};

module.exports = { sendmail };
