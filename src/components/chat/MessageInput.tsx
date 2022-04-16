import { ChangeEvent, memo, useRef, useEffect } from "react";

// UI //
import styles from "./MessageInput.module.css";
import { FormControl, FormHelperText, TextField } from "@mui/material";

interface Props {
  messageError: string;
  messageValue: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
  sendMessageHandler: () => void;
}

function MessageInput({
  messageError,
  messageValue,
  setMessageError,
  setMessageValue,
  sendMessageHandler,
}: Props): JSX.Element {
  const inputFieldRef = useRef<HTMLElement | null>(null);

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
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      sendMessageHandler();
    }
  }

  return (
    <main className={styles.input_field_wrapper} ref={inputFieldRef}>
      <FormControl error={messageError !== ""}>
        <TextField
          value={messageValue}
          onChange={onChangeHandler}
          onKeyDown={onSubmitUsingEnter}
          multiline={true}
          maxRows={4}
          placeholder="Send a message"
          className={styles.input_field}
          error={messageError !== ""}
          id="custom_scroll_2"
        />
      </FormControl>
      <FormHelperText className={styles.error}>{messageError}</FormHelperText>
    </main>
  );
}

export default memo(MessageInput);
