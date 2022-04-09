import { FormControl, FormHelperText, TextField } from "@mui/material";
import { ChangeEvent, memo, MutableRefObject, useEffect } from "react";

// UI //
import styles from "./MessageInput.module.css";

interface Props {
  messageError: string;
  messageValue: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
  sendMessageHandler: () => void;
  chatBoardRef: MutableRefObject<HTMLDivElement | null>;
  logsRef: MutableRefObject<HTMLDivElement | null>;
  inputRef: MutableRefObject<HTMLDivElement | null>;
  buttonsRef: MutableRefObject<HTMLDivElement | null>;
}

function MessageInput({
  messageError,
  messageValue,
  setMessageError,
  setMessageValue,
  sendMessageHandler,
}: Props): JSX.Element {
  useEffect(() => {
    setMessageValue("");
  }, []);

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setMessageError("");
    const value = e.target.value;
    if (value.length > 250) {
      setMessageError("The message exceeds 250-charater limit");
      return;
    }
    setMessageValue(value);
  }

  function onSubmitUsingEnter(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.code === "Enter") {
      e.preventDefault();
      sendMessageHandler();
    }
  }

  return (
    <main className={styles.input_field_wrapper}>
      <FormControl error={messageError !== ""}>
        <TextField
          value={messageValue}
          onChange={onChangeHandler}
          onKeyDown={onSubmitUsingEnter}
          multiline={true}
          maxRows={3}
          placeholder="Send a message"
          className={styles.input_field}
          error={messageError !== ""}
        />
      </FormControl>
      <FormHelperText className={styles.error}>{messageError}</FormHelperText>
    </main>
  );
}

export default memo(MessageInput);
