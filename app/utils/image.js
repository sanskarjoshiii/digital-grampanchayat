"use client";

/**
 * Shrink a picture in the browser before it is uploaded.
 *
 * A photo straight off a phone camera is routinely 4–9 MB, which was failing
 * outright against the 5 MB profile bucket, and would have cost a villager
 * several megabytes of mobile data for an image displayed at 80 pixels.
 *
 * Downscaling to `maxSide` and re-encoding as JPEG turns a 6 MB photo into
 * roughly 150–300 KB with no visible loss at the sizes this site displays.
 * If anything goes wrong — an unusual format, a browser without canvas — the
 * original file is returned so the upload still has a chance of succeeding.
 */
export const shrinkImage = async (file, { maxSide = 1024, quality = 0.82 } = {}) => {
  if (!file || !file.type?.startsWith("image/")) return file;
  // Small files are already fine; re-encoding them can make them larger.
  if (file.size < 400 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
};

/** Human-readable size, for telling someone why their file was refused. */
export const readableSize = (bytes) => {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};
