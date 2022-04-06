import { MutableRefObject } from "react";

export function resizeChatBoard(
  chatBoardRef: MutableRefObject<HTMLDivElement | null>,
  inputRef: MutableRefObject<HTMLDivElement | null>,
  logsRef: MutableRefObject<HTMLDivElement | null>,
  buttonsRef: MutableRefObject<HTMLDivElement | null>
) {
  console.log("in chatBoard, resize the input-container");
  inputRef.current!.style.height = "auto";

  const diff =
    chatBoardRef.current!.offsetHeight - inputRef.current!.scrollHeight;
  logsRef.current!.style.height = diff + "px";
  // (1) //
  buttonsRef.current!.style.minHeight = inputRef.current!.scrollHeight + "px";
  buttonsRef.current!.style.bottom = inputRef.current!.scrollHeight - 40 + "px";

  console.log(buttonsRef.current!.scrollHeight);
}

// NOTE //
/*
  (1)
  also resize the buttons-container's height to cover the input-container's
  background (If I did not use the transparent background in the chat-logs
  I DO NOT have to resize the buttons-containe, because the background
  nconsistence won't be noticeable)
*/
