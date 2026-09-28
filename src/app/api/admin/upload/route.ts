import { handle } from "@/lib/admin/http";
import { createBlob } from "@/lib/admin/github";
import { ValidationError } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

const MAX_BYTES = 3 * 1024 * 1024; // images are compressed in the browser first; this is a safety cap

/* Store one image as a git blob. It only becomes part of the site when the
   post/project that references it is saved (which commits the blob). */
export async function POST(req: Request) {
  return handle(async () => {
    const { data } = await req.json();
    if (typeof data !== "string") throw new ValidationError("No image data.");
    const bytes = Buffer.from(data, "base64");
    if (!bytes.length || bytes.length > MAX_BYTES) throw new ValidationError("Image is empty or larger than 3 MB after compression.");

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
    const isPng = bytes.subarray(0, 4).toString("hex") === "89504e47";
    const isWebp = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
    const isGif = bytes.subarray(0, 3).toString() === "GIF";
    if (!isJpeg && !isPng && !isWebp && !isGif) throw new ValidationError("That file isn't a supported image (JPEG, PNG, WebP, GIF).");

    return { sha: await createBlob(data) };
  });
}
