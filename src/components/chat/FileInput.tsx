import { ChangeEvent, memo } from "react";

// UI //
import styles from "./ImageInput.module.css";
import { InputLabel } from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

interface Props {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  clearImageHandler: () => void;
  setTextFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setSizeExceeded: React.Dispatch<React.SetStateAction<string>>;
  setNotSupported: React.Dispatch<React.SetStateAction<string>>;
}

const fileExtensions = [
  "pdf",
  "txt",
  "doc",
  "docx",
  "docm",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
];

function FileInput({
  fileInputRef,
  clearImageHandler,
  setTextFile,
  setSizeExceeded,
  setNotSupported,
}: Props): JSX.Element {
  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    clearImageHandler();
    setSizeExceeded("");
    setNotSupported("");

    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0] as File;

      // 5 MB max size
      if (newFile.size > 5000000) {
        setSizeExceeded("The file exceeds the maximum allowed size (5 MB)");
        return;
      }
      // the type of file is not consistent, For txt file, the type is 'text/plain',
      // but for "microsoft word", it is "application/many-different-extensions"
      // I should just check the extension of the file by splitting the file name
      const ext = newFile.name.split(".")[1].toLowerCase();
      if (!fileExtensions.includes(ext)) {
        setNotSupported("The file you selected is not supported");
        return;
      }
      setTextFile(newFile);
    }
  };

  return (
    <main className={styles.icon_wrapper}>
      <InputLabel htmlFor="add-file">
        <UploadFileRoundedIcon className={styles.input_icon} />
      </InputLabel>
      <input
        onChange={onFileChangeHandler}
        type="file"
        accept=".pdf, .txt, .doc, .docx, .docm, .xls, .xlsx, .ppt, .pptx"
        ref={fileInputRef}
        id="add-file"
        className={styles.input_field}
      />
    </main>
  );
}

export default memo(FileInput);
