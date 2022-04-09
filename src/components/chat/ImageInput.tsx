import { ChangeEvent, memo } from "react";

// UI //
import styles from "./ImageInput.module.css";
import { InputLabel } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Props {
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
  clearFileHandler: () => void;
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
  imageInputRef,
  clearFileHandler,
  setImageFile,
  setSizeExceeded,
  setNotSupported,
}: Props): JSX.Element {
  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    // user can only send either image or textFile at a time
    clearFileHandler();
    setSizeExceeded("");
    setNotSupported("");

    console.log(e.target);

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
    <main className={styles.icon_wrapper}>
      <InputLabel htmlFor="add-image">
        <AddPhotoAlternateIcon className={styles.input_icon} />
      </InputLabel>
      <input
        onChange={onImageChangeHandler}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        ref={imageInputRef}
        id="add-image"
        className={styles.input_field}
      />
    </main>
  );
}

export default memo(ImageInput);
