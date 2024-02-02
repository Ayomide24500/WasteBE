import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
const GOOGLE_ID =
  "338600539682-3p0gjosdmnrt4r6tnj5ubf5hjvnugfi7.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REDIRECT_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH =
  "1//04hwuB3riCsPbCgYIARAAGAQSNwF-L9IrpC2o9EZUtAuvSsDpLN7h6o0eTzVk61JuQZq0-TdlYhI4sHtrVfAbM2-m1FWFirU8Qww";

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

const URL: string = `http://localhost:1200`;

export const sendEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ayomideadisa83@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const getFile = path.join(__dirname, "../views/index.ejs");

    const data = {
      token: user.token,
      email: user.email,
      url: `${URL}/user-verify/${user._id}`,
    };

    const html = await ejs.renderFile(getFile, { data });

    const mailer = {
      from: "Ayomide 🚀👍 <ayomideadisa83@gmail.com>",
      to: user.email,
      subject: "Account Opening",
      html,
    };

    await transport.sendMail(mailer).then(() => {
      console.log("send");
    });
  } catch (error) {
    return error;
  }
};

export const sendResetPasswordEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ayomideadisa83@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });
    const getFile = path.join(__dirname, "../views/resetPassword.ejs");

    const data = {
      token: user.token,
      email: user.email,
      url: `${URL}/user-verify/${user._id}`,
    };

    const html = await ejs.renderFile(getFile, { data });

    const mailer = {
      from: "Ayomide 🚀👍 <ayomideadisa83@gmail.com>",
      to: user.email,
      subject: "Account Opening",
      html,
    };

    await transport.sendMail(mailer).then(() => {
      console.log("send reset");
    });
  } catch (error) {
    return error;
  }
};
