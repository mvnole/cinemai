import dotenv from "dotenv";
dotenv.config();

import { s3 } from "./server.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE_URL (DEBUG):", process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function filmHandler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    // 1. Verificare token user
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 2. Ia userul din token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (!user || userError) {
      return res.status(401).json({ error: "User not found or not authenticated" });
    }

    // 3. Ia ID-ul filmului din params
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing film id" });
    }

    // 4. Ia cheia B2 din Supabase (tabelul films)
    const { data, error } = await supabase
      .from("films")
      .select("b2_key")
      .eq("id", id)
      .single();

    if (error || !data || !data.b2_key) {
      return res.status(404).json({ error: "Film not found sau key missing" });
    }

    // 5. Scoate partea cu numele bucketului din key dacă există
    let fileKey = data.b2_key;
    const BUCKET_NAME = process.env.B2_BUCKET || "";
    if (fileKey.startsWith(BUCKET_NAME + "/")) {
      fileKey = fileKey.slice(BUCKET_NAME.length + 1);
    }

    // 6. Generează link semnat
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 600 });

    return res.status(200).json({ url });

  } catch (err) {
    console.error("filmHandler error:", err);
    return res.status(500).json({
      error: "Could not generate signed url",
      details: err.message || err.toString(),
    });
  }
}
