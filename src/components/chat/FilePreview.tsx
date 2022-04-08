import { memo, useEffect, useRef, useState } from "react";

// UI //
import styles from "./FilePreview.module.css";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";

interface Props {
  imageFile: File | undefined;
  textFile: File | undefined;
  clearHandler: () => void;
  isImage: boolean;
}

function FilePreview({
  imageFile,
  textFile,
  clearHandler,
  isImage,
}: Props): JSX.Element {
  const imageRef = useRef<HTMLDivElement | null>(null);

  let file_icon = "";
  if (textFile) {
    const ext = textFile.name.split(".")[1].toLowerCase();
    switch (ext) {
      case "pdf":
        file_icon = pdf_icon;
        break;
      case "txt":
        file_icon = txt_icon;
        break;
      case "doc":
      case "docx":
      case "docm":
        file_icon = docx_icon;
        break;
      case "xls":
      case "xlsx":
        file_icon = xlsx_icon;
        break;
      case "ppt":
      case "pptx":
        file_icon = pptx_icon;
        break;
    }
  }

  useEffect(() => {
    if (imageFile) {
      // Don't know why, when I set the wrapper height to 150px, which is the
      // max-height of the image, the input-container dose not expand for 150px
      // But when I set the height to "200px", the input-container will expand
      // to the height which is high enough for the 150px image in it.
      // the 50px difference might be the height of the msg-input field?
      // This method works the best for the expanding transition, the only
      // drawback is a empty div must always be mounted. But the image inside
      // this empty div conditionally.
      imageRef.current!.style.height = "200px";
    } else {
      imageRef.current!.style.height = "0";
    }
  }, [imageFile]);

  return (
    <>
      <div className={styles.preview_image_wrapper} ref={imageRef}>
        {imageFile && (
          <>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
              className={styles.preview_image}
            />
            <button onClick={clearHandler}>clear</button>
          </>
        )}
      </div>

      {textFile && !isImage && (
        <div className={styles.preview_file_wrapper}>
          <div className={styles.file_sub_wrapper}>
            <AttachFileRoundedIcon />
            <img
              src={file_icon}
              alt="preview"
              className={styles.preview_file}
            />
            <div>{textFile.name}</div>
            <button onClick={clearHandler}>clear</button>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(FilePreview);
