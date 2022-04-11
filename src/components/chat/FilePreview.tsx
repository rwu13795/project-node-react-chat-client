import { memo, useEffect, useRef } from "react";

// UI //
import styles from "./FilePreview.module.css";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";
import { FileIcons, getFileIcon } from "../../utils";

interface Props {
  imageFile: File | undefined;
  textFile: File | undefined;
  clearHandler: () => void;
  isImage: boolean;
}

const fileIcons: FileIcons = {
  txt: txt_icon,
  doc: docx_icon,
  pdf: pdf_icon,
  ppt: pptx_icon,
  xls: xlsx_icon,
};

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
    file_icon = getFileIcon(fileIcons, ext);
  }

  useEffect(() => {
    if (!imageRef || !imageRef.current) return;
    if (imageFile) {
      // Don't know why, when I set the wrapper height to 150px, which is the
      // max-height of the image, the input-container dose not expand for 150px
      // But when I set the height to "200px", the input-container will expand
      // to the height which is high enough for the 150px image in it.
      // the 50px difference might be the height of the msg-input field?
      // This method works the best for the expanding transition, the only
      // drawback is a empty div must always be mounted. But the image inside
      // this empty div conditionally.
      imageRef.current.style.height = "234px";
    } else {
      imageRef.current.style.height = "0";
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
            <HighlightOffIcon
              onClick={clearHandler}
              className={styles.delete_button}
            />
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
            <HighlightOffIcon
              onClick={clearHandler}
              className={styles.delete_button}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default memo(FilePreview);
