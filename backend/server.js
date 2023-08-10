// const functions = require("firebase-functions");
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const multer = require("multer");

const PORT = process.env.PORT || 8080;
const app = express();
const upload = multer({ dest: "uploads/" });

// urlencoded middleware
app.use(express.urlencoded({ extended: false }));

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
  res.json({ message: "Hello from Server" });
});
app.get("/heartbeat", (req, res) => {
  res.json({ message: "Server is live" });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  let file = req.file;
  console.log("file :>> ", file);
  await uploadFile(file);
  fs.unlinkSync(file.path);
  res.json({ message: "File has been uploaded" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
