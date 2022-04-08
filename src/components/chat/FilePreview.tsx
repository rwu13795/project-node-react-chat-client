import { memo } from "react";

// UI //
import styles from "./FilePreview.module.css";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import txt_icon from "../../images/file-icons/txt_icon.webp";
import docx_icon from "../../images/file-icons/docx_icon.webp";
import pdf_icon from "../../images/file-icons/pdf_icon.webp";
import pptx_icon from "../../images/file-icons/pptx_icon.webp";
import xlsx_icon from "../../images/file-icons/xlsx_icon.webp";

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
  const wrapper = isImage
    ? styles.preview_image_wrapper
    : styles.preview_file_wrapper;

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

  return (
    <>
      {imageFile && (
        <div className={wrapper}>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className={styles.preview_image}
          />
          <button onClick={clearHandler}>clear</button>
        </div>
      )}

      {textFile && (
        <div className={wrapper}>
          <AttachFileRoundedIcon />
          <div>{textFile.name}</div>
          <div>{textFile.size}</div>
          <button onClick={clearHandler}>clear</button>
        </div>
      )}
    </>
  );
}

export default memo(FilePreview);
