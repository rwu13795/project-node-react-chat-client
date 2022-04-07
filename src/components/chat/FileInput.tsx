import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  chatType,
  MessageObject,
  msgType,
  TargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  Friend,
  Group,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { message_emitter } from "../../socket-io/emitters";

interface Props {
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
  setTextFile,
  setSizeExceeded,
  setNotSupported,
}: Props): JSX.Element {
  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
      // for "msWord", it is "application/many-different-extensions"
      // I should just check the extension of the file by splitting the file name
      const ext = newFile.name.split(".")[1];
      if (!fileExtensions.includes(ext)) {
        setNotSupported("The file you selected is not supported");
        return;
      }
      setTextFile(newFile);
    }
  };

  return (
    <main>
      <input
        onChange={onFileChangeHandler}
        type="file"
        accept=".pdf, .txt, .doc, .docx, .docm, .xls, .xlsx, .ppt, .pptx"
      />
      <input type="submit" />
    </main>
  );
}

export default memo(FileInput);
