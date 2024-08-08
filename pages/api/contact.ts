// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from "nodemailer";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     service: process.env.NODEMAILER_SERVICE,
//     auth: {
//       user: process.env.NODEMAILER_USER,
//       pass: process.env.NODEMAILER_PASS,
//     },
//   })

//   const mailOptions = {
//     from: process.env.NODEMAILER_FROM,
//     to: process.env.NODEMAILER_TO,
//     subject: "JOBVP Contact Form",
//     text: `[Name]\n${req.body.name}\n\n[Email]\n${req.body.email}\n\n[Message]\n${req.body.message}`,
//   };

//   const info = await transporter.sendMail(mailOptions);

//   // TODO: Inspect info and return error if necessary.

//   res.status(200).json("success");
// }
