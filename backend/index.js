const functions = require("firebase-functions");
const { google } = require("googleapis");
const cors = require("cors")({ origin: true });

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

exports.uploadFile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "Not allowed",
      });
    }

    let file = req.body.file;
    const today = new Date();

    const uploadFile = async (file) => {
      const filePath = path.join(__dirname, file);
      try {
        const res = await drive.files.create({
          requestBody: {
            name: `resume-upload-${today}.jpeg`,
            mimeType: "image/jpeg",
          },
          media: {
            mimeType: "image/jpeg",
            body: fs.createReadStream(filePath),
          },
        });

        console.log("res.data :>> ", res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
  });
});