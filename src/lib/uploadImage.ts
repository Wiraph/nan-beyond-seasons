"use client";

import { getUid, supabase } from "./supabase";

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB raw cap

export class ImageError extends Error {}

/** Draw the image onto a canvas capped at `maxPx` on its longest side and
 *  re-encode as JPEG. Keeps uploads small/fast and localStorage sane. */
async function compress(
  file: File,
  maxPx = 1200,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string }> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new ImageError("decode-failed");
  });
  const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("no-canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) throw new ImageError("encode-failed");
  return { blob, dataUrl };
}

/** Compress then upload to Supabase Storage (public URL) when configured,
 *  else return a compressed data URL that persists locally on this device. */
export async function uploadPostImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new ImageError("not-image");
  if (file.size > MAX_UPLOAD_BYTES) throw new ImageError("too-large");

  const { blob, dataUrl } = await compress(file);

  if (!supabase) return dataUrl; // local-only fallback

  const path = `${getUid()}/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) {
    // Storage not set up or offline — fall back to local data URL so the
    // post still works rather than failing outright.
    console.warn("image upload failed:", error.message);
    return dataUrl;
  }
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}
