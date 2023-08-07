// const functions = require("firebase-functions");
const { google } = require("googleapis");
const cors = require("cors")({ origin: true });
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// let file = req.body.file;
const today = new Date();

const filePath = path.join(__dirname, "chess.png");
const uploadFile = async () => {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: `resume-upload-${today}.png`,
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(filePath),
      },
    });

    console.log("res.data :>> ", res.data);
  } catch (error) {
    console.log("error", error);
  }
};
uploadFile();

// exports.uploadFile = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
//     if (req.method !== "POST") {
//       return res.status(500).json({
//         message: "Not allowed",
//       });
//     }

//     let file = req.body.file;
//     const today = new Date();

//     const uploadFile = async (file) => {
//       const filePath = path.join(__dirname, file);
//       try {
//         const res = await drive.files.create({
//           requestBody: {
//             name: `resume-upload-${today}.png`,
//             mimeType: "image/png",
//           },
//           media: {
//             mimeType: "image/png",
//             body: fs.createReadStream(filePath),
//           },
//         });

//         console.log("res.data :>> ", res.data);
//       } catch (error) {
//         console.log("error", error);
//       }
//     };
//     uploadFile();
//   });
// });

// const express = require("express");
// const fileupload = require("express-fileupload");
// const path = require("path");

// const PORT = process.env.PORT || 8080;
// const app = express();

// // initial test route
// // app.get("/", (req, res) => {
// //   res.send("Hello World!");
// // })
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
