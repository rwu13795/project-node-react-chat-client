import {
  ChangeEvent,
  MouseEvent,
  FormEvent,
  memo,
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectCurrentUser,
  selectFriendsList,
  selectResult_addFriendRequest,
  setLoadingStatus_user,
  setResult_addFriendRequest,
} from "../../redux/user/userSlice";
import { client, serverUrl } from "../../redux/utils";
import { addFriendRequest_emitter } from "../../socket-io/emitters";
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

// UI //
import styles from "./SearchUser.module.css";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import UserAvatar from "../menu/top/UserAvatar";
import SearchFound from "./SearchFound";

interface Props {
  socket: Socket | undefined;
}

function SearchUser({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const friendsList = useSelector(selectFriendsList);
  const currentUser = useSelector(selectCurrentUser);
  const result_addFriendRequest = useSelector(selectResult_addFriendRequest);

  const [emailValue, setEmailValue] = useState<InputValues>({
    [inputNames.email]: "",
  });
  const [emailError, setEmailError] = useState<InputErrors>({
    [inputNames.email]: "",
  });
  const [idValue, setIdValue] = useState<InputValues>({
    User_ID: "",
  });
  const [idError, setIdError] = useState<InputErrors>({
    User_ID: "",
  });

  const [foundUser, setFoundUser] = useState<{
    user_id: string;
    username: string;
    avatar_url: string;
  }>({ user_id: "", username: "", avatar_url: "" });
  const [isFound, setIsFound] = useState<boolean>(false);
  const [findById, setFindById] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function submitSearchHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    setErrorMsg("");
    setFoundUser({ user_id: "", username: "", avatar_url: "" });
    dispatch(setResult_addFriendRequest(""));

    let hasError = false;
    if (findById) {
      hasError = onSubmitCheck(idValue, setIdError);
      console.log(currentUser.user_id, idValue.User_ID);
      if (currentUser.user_id === idValue.User_ID) {
        setErrorMsg("You cannot add yourself as a friend.....");
        hasError = true;
      }
    } else {
      hasError = onSubmitCheck(emailValue, setEmailError);
      if (currentUser.email === emailValue.email) {
        setErrorMsg("You cannot add yourself as a friend.....");
        hasError = true;
      }
    }
    if (hasError) return;

    try {
      const { data } = await client.post<
        { user_id: string; username: string; avatar_url: string }[]
      >(serverUrl + `/user/search-user`, {
        user_id: idValue.User_ID,
        user_email: emailValue[inputNames.email],
      });

      if (data.length === 0) {
        setErrorMsg("This user is does not exist in our record.");
        setIsFound(false);
      } else {
        setFoundUser({ ...data[0] });
        setIsFound(true);
        if (friendsList[data[0].user_id] !== undefined) {
          setErrorMsg("This user is your friend already.");
        }
      }
    } catch (err: any) {
      console.log(err.response.data.errors);
    }
  }

  function toggleFindBy(e: ChangeEvent<HTMLInputElement>) {
    setErrorMsg("");
    dispatch(setResult_addFriendRequest(""));
    if (e.currentTarget.value === "id") setFindById(true);
    else setFindById(false);
  }

  function addFriendRequestHandler(message: string) {
    const { user_id, username, email, avatar_url } = currentUser;
    if (socket) {
      dispatch(
        setLoadingStatus_user(loadingStatusEnum.addFriendRequest_loading)
      );
      addFriendRequest_emitter(socket, {
        sender_id: user_id,
        sender_username: username,
        sender_email: email,
        sender_avatar: avatar_url || username[0],
        message,
        target_id: foundUser.user_id,
      });
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setResult_addFriendRequest(""));
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.title}>Search Friend</div>
      <div className={styles.border}></div>
      <RadioGroup
        defaultValue="id"
        className={styles.radio_group}
        onChange={toggleFindBy}
      >
        <FormControlLabel
          value="id"
          control={<Radio size="small" />}
          label={<span className={styles.radio_lable}>Find by ID</span>}
        />
        <FormControlLabel
          value="email"
          control={<Radio size="small" />}
          label={<span className={styles.radio_lable}>Find by email</span>}
        />
      </RadioGroup>

      <form onSubmit={submitSearchHandler}>
        <div className={styles.input_field}>
          {findById
            ? Object.entries(idValue).map(([name, value]) => {
                return (
                  <InputField
                    key={name}
                    inputName={name}
                    inputValue={value}
                    inputError={idError[name]}
                    requestError=""
                    setInputValues={setIdValue}
                    setInputErrors={setIdError}
                    size={inputFieldSizes.medium}
                  />
                );
              })
            : Object.entries(emailValue).map(([name, value]) => {
                return (
                  <InputField
                    key={name}
                    inputName={name}
                    inputValue={value}
                    inputError={emailError[name]}
                    requestError=""
                    setInputValues={setEmailValue}
                    setInputErrors={setEmailError}
                    size={inputFieldSizes.medium}
                  />
                );
              })}
        </div>

        <Button
          type="submit"
          variant="outlined"
          className={styles.button}
          onClick={submitSearchHandler}
        >
          Search
        </Button>
      </form>

      {isFound && friendsList[foundUser.user_id] === undefined && (
        <SearchFound
          username={foundUser.username}
          avatar_url={foundUser.avatar_url}
          addFriendRequestHandler={addFriendRequestHandler}
        />
      )}
      <div className={styles.error_text}>{errorMsg}</div>
      <div className={styles.error_text}>{result_addFriendRequest}</div>
    </main>
  );
}

export default memo(SearchUser);
