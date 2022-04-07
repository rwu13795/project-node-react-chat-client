import { ChangeEvent, memo, useEffect, useState } from "react";

// UI //
import styles from "./ImageInput.module.css";

interface Props {
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setSizeExceeded: React.Dispatch<React.SetStateAction<string>>;
  setNotSupported: React.Dispatch<React.SetStateAction<string>>;
}

export const imageTypes = [
  "image/apng",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
];

function ImageInput({
  setImageFile,
  setSizeExceeded,
  setNotSupported,
}: Props): JSX.Element {
  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSizeExceeded("");
    setNotSupported("");

    if (e.target.files && e.target.files.length > 0) {
      const newImage = e.target.files[0] as File;

      // 5 MB max size
      if (newImage.size > 5000000) {
        setSizeExceeded("The image exceeds the maximum allowed size (5 MB)");
        return;
      }
      // the type of image is consistent "image/..."
      // I can just check the "type" for supported image type
      if (!imageTypes.includes(newImage.type)) {
        setNotSupported("Only PNG, JPG, JPEG or GIF image is supported");
        return;
      }
      setImageFile(newImage);
    }
  };

  return (
    <main>
      <input
        onChange={onImageChangeHandler}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
      />
    </main>
  );
}

export default memo(ImageInput);
