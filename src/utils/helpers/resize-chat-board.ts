import { MutableRefObject } from "react";

export function resizeChatBoard(
  chatBoardRef: MutableRefObject<HTMLDivElement | null>,
  inputRef: MutableRefObject<HTMLDivElement | null>,
  logsRef: MutableRefObject<HTMLDivElement | null>,
  buttonsRef: MutableRefObject<HTMLDivElement | null>
) {
  inputRef.current!.style.height = "auto";

  const diff =
    chatBoardRef.current!.offsetHeight - inputRef.current!.scrollHeight;
  logsRef.current!.style.height = diff + "px";
  // (1) //
  buttonsRef.current!.style.minHeight =
    inputRef.current!.scrollHeight + 10 + "px";
  buttonsRef.current!.style.bottom = inputRef.current!.scrollHeight - 30 + "px";
}

// NOTE //
/*
  (1)
  also resize the buttons-container's height to cover the input-container's
  background (If I did not use the transparent background in the chat-logs
  I DO NOT have to resize the buttons-containe, because the background
  nconsistence won't be noticeable)


  Updated Note
  a new method is found to solve the expansion issue of the input-container
  No need to use the resize function, read the detail in the "FilePreview"
*/
