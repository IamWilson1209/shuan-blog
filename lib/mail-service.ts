import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export const handleSendMail = async (to: string, subject: string, content: string) => {
  return await new Promise((resolve, reject) => {
    if (!to || !subject || !content) {
      reject(new Error('內容不可為空'));
      return;
    }

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    oauth2Client
      .getAccessToken()
      .then((res) => {
        const accessToken = res.token;
        if (!accessToken) {
          throw new Error('無法取得有效的 Access Token');
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'zenfonlee@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });

        const mailOptions = {
          from: 'zenfonlee@gmail.com',
          to,
          subject,
          html: content,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve({ message: 'Email 已發送', info });
          }
        });
      })
      .catch((err) => {
        reject(new Error(`無法取得 OAuth Access Token: ${err.message}`));
      });
  });
};