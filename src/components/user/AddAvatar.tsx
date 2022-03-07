import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
// import { cropPreview } from './cropPreview'
// import { debounce } from './debounce'

import "react-image-crop/dist/ReactCrop.css";
import { Socket } from "socket.io-client";
import cropImage from "../../utils/helpers/crop-image";

export default function AddAvatar(): JSX.Element {
  const [imgSrc, setImgSrc] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const imgRef = useRef<any>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result) {
          setImgSrc(reader.result.toString() || "");
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    // This is to demonstate how to make and center a % aspect crop
    // which is a bit trickier so we use some helper functions.
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 50,
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  function changeAvatarHandler() {
    console.log(croppedImageBlob);
  }

  const cropImageCallback = useCallback(
    async (completedCrop: PixelCrop, scale: number, rotate: number) => {
      if (completedCrop) {
        const blob = await cropImage(
          imgRef.current,
          completedCrop,
          scale,
          rotate
        );
        if (blob !== null) {
          setPreviewSrc(URL.createObjectURL(blob));
          setCroppedImageBlob(blob);
        }
      }
    },
    []
  );

  // whenever the image is cropped, update the preview and the blob
  useEffect(() => {
    if (completedCrop) {
      cropImageCallback(completedCrop, scale, rotate);
    }
  }, [completedCrop, scale, rotate, cropImageCallback]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
      </div>
      {Boolean(imgSrc) && (
        <div
          style={{
            width: "400px",
            height: "400px",
            border: "solid red 2px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={true}
          >
            <img
              alt="Crop me"
              src={imgSrc}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                width: "400px",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      )}

      <div>
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Crop preview"
            style={{
              width: "200px",
              height: "200px",
              border: "solid red 1px",
              borderRadius: "100px",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      <button onClick={changeAvatarHandler}>change avatar</button>
    </div>
  );
}
