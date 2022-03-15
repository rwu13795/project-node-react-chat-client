import { PixelCrop } from "react-image-crop";

const TO_RADIANS = Math.PI / 180;

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve: (blob: Blob | null) => void) => {
    canvas.toBlob(resolve);
  });
}

export async function cropImage(
  image: HTMLImageElement,
  crop: PixelCrop | undefined,
  scale = 1,
  rotate = 0
): Promise<Blob | null> {
  if (!crop) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // const pixelRatio = window.devicePixelRatio || 1
  const pixelRatio = 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  const blob = await toBlob(canvas);
  return blob;
}
