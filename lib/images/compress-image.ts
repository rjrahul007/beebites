export async function compressImageFile(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 - 1
    outputFormat?: "image/webp" | "image/jpeg";
  },
) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    outputFormat = "image/webp",
  } = options || {};

  if (!file.type.startsWith("image/")) {
    throw new Error("Not an image file");
  }

  // ✅ Decode image
  const bitmap = await createImageBitmap(file);

  // ✅ Calculate new dimensions (keep aspect ratio)
  let targetWidth = bitmap.width;
  let targetHeight = bitmap.height;

  const widthRatio = maxWidth / targetWidth;
  const heightRatio = maxHeight / targetHeight;
  const ratio = Math.min(widthRatio, heightRatio, 1); // never upscale

  targetWidth = Math.round(targetWidth * ratio);
  targetHeight = Math.round(targetHeight * ratio);

  // ✅ Draw into canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  // ✅ Convert canvas -> compressed blob
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) return reject(new Error("Compression failed"));
        resolve(b);
      },
      outputFormat,
      quality,
    );
  });

  // ✅ Create a new File (so upload works cleanly)
  const ext = outputFormat === "image/webp" ? "webp" : "jpg";
  const compressedFile = new File([blob], `menu-image.${ext}`, {
    type: outputFormat,
  });

  return compressedFile;
}
