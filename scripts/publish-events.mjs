import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const root = process.cwd();
const events = JSON.parse(
  await readFile(path.join(root, "src", "data", "sportsEvents.json"), "utf8"),
);
const imageDir = path.join(root, "public", "events");
const imageFiles = new Set(await readdir(imageDir));
const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const imagePathFor = (event) => {
  const localPath = event.image?.replace(/^\/events\//, "");
  return localPath && imageFiles.has(localPath) ? `events/${localPath}` : null;
};

let uploadedImages = 0;
const rows = [];

for (const [displayOrder, event] of events.entries()) {
  const imagePath = imagePathFor(event);
  let publicUrl = null;

  if (imagePath) {
    const localFile = path.join(imageDir, path.basename(imagePath));
    const body = await readFile(localFile);
    const contentType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";
    const { error } = await supabase.storage.from("event-images").upload(imagePath, body, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });
    if (error) throw new Error(`Could not upload ${imagePath}: ${error.message}`);
    publicUrl = supabase.storage.from("event-images").getPublicUrl(imagePath).data.publicUrl;
    uploadedImages += 1;
  }

  rows.push({
    id: event.id,
    event_data: { ...event, image: publicUrl },
    image_path: imagePath,
    display_order: displayOrder,
  });
}

const { error } = await supabase.from("events").upsert(rows, { onConflict: "id" });
if (error) throw new Error(`Could not publish events: ${error.message}`);

console.log(`Published ${rows.length} events and ${uploadedImages} event images.`);
