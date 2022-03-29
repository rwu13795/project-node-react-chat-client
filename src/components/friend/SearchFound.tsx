import { memo, useEffect, useState } from "react";

import {
  AvatarOptions,
  inputFieldSizes,
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
} from "../../utils";
import InputField, {
  InputErrors,
  InputValues,
} from "../input-field/InputField";
import UserAvatar from "../menu/top/UserAvatar";

// UI //
import styles from "./SearchFound.module.css";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { selectLoadingStatus_user } from "../../redux/user/userSlice";

interface Props {
  username: string;
  avatar_url: string;
  addFriendRequestHandler: (message: string) => void;
}

function SearchFound({
  username,
  avatar_url,
  addFriendRequestHandler,
}: Props): JSX.Element {
  const loadingStatus = useSelector(selectLoadingStatus_user);

  const [messageInput, setMessageInput] = useState<InputValues>({
    [inputNames.message]: "",
  });
  const [messageError, setMessageError] = useState<InputErrors>({
    [inputNames.message]: "",
  });

  function sendRequestHandler() {
    const hasError = onSubmitCheck(messageInput, setMessageError);
    if (hasError) return;

    addFriendRequestHandler(messageInput[inputNames.message]);
  }

  return (
    <main className={styles.found_wrapper}>
      <div className={styles.border}></div>
      <div className={styles.avatar_wrapper}>
        <UserAvatar
          username={username}
          avatar_url={avatar_url}
          socket={undefined}
          option={AvatarOptions.topAvatar}
        />
        {username}
      </div>

      {Object.entries(messageInput).map(([name, value]) => {
        return (
          <InputField
            key={name}
            inputName={name}
            inputValue={value}
            inputError={messageError[name]}
            requestError=""
            setInputValues={setMessageInput}
            setInputErrors={setMessageError}
            size={inputFieldSizes.medium}
            useMultiline={true}
          />
        );
      })}
      <div className={styles.button_wrapper}>
        <LoadingButton
          variant="outlined"
          disabled={
            loadingStatus === loadingStatusEnum.addFriendRequest_loading
          }
          loading={loadingStatus === loadingStatusEnum.addFriendRequest_loading}
          className={styles.button}
          onClick={sendRequestHandler}
        >
          Send request
        </LoadingButton>
      </div>
    </main>
  );
}

export default memo(SearchFound);
