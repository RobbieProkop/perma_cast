const functions = require("firebase-functions");
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const os = require("os");

const multer = require("multer");

const tempDir = os.tmpdir();

const app = express();
const upload = multer({
  dest: tempDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    fieldSize: 5 * 1024 * 1024, // 5MB
  },
});
// const upload = multer({
//   startProcessing(req, busboy) {
//     if (req.rawBody) {
//       // indicates the request was pre-processed
//       busboy.end(req.rawBody);
//     } else {
//       req.pipe(busboy);
//     }
//   },
// });

app.use(cors());
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

const uploadFile = async (file) => {
  const mime = file.mimetype;
  const name = file.originalname;
  try {
    const res = await drive.files.create({
      requestBody: {
        name: name,
        mimeType: mime,
      },
      media: {
        mimeType: mime,
        body: fs.createReadStream(file.path),
      },
    });

    console.log("res.data :>> ", res.data);
  } catch (error) {
    console.log("error", error);
  }
};

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Firebase" });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  let file = req.file;
  console.log("file :>> ", file);
  await uploadFile(file);
  if (req.rawBody) {
    // indicates the request was pre-processed
    busboy.end(req.rawBody);
  } else {
    req.pipe(busboy);
  }
  fs.unlinkSync(file.path);
  res.json({ message: "File has been uploaded" });
});

// app.use((error, req, res, next) => {
//   const message = `This is unexpected => "${error}"`;
//   console.log("message :>> ", message);
//   return res.status(500).send(message);
// });

exports.app = functions.https.onRequest(app);
