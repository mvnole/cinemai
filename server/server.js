import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import filmHandler from "./filmHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

export const s3 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
});

app.get("/api/film/:id", filmHandler);

app.get('/api/filme/:key(*)', async (req, res) => {
  const key = req.params.key;
  if (!key) return res.status(400).json({ error: "Lipsește key-ul filmului" });
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Eroare la generarea linkului", details: err.message });
  }
});

console.log("Rute definite:", app._router.stack.filter(r => r.route).map(r => r.route.path));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Serverul rulează pe portul", PORT);
  console.log("Rute pornite:", app._router.stack.filter(r => r.route).map(r => r.route.path));
});
