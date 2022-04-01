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
  inputFieldSizes,
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
} from "../../utils";
import InputField, { InputFields } from "../input-field/InputField";

// UI //
import styles from "./SearchUser.module.css";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import SearchFound from "./SearchFound";

interface Props {
  socket: Socket | undefined;
}

function SearchUser({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const friendsList = useSelector(selectFriendsList);
  const currentUser = useSelector(selectCurrentUser);
  const result_addFriendRequest = useSelector(selectResult_addFriendRequest);

  const [idInput, setIdInput] = useState<InputFields>({
    [inputNames.user_ID]: "",
  });
  const [idError, setIdError] = useState<InputFields>({
    [inputNames.user_ID]: "",
  });
  const [emailInput, setEmailInput] = useState<InputFields>({
    [inputNames.email]: "",
  });
  const [emailError, setEmailError] = useState<InputFields>({
    [inputNames.email]: "",
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
    setIsFound(false);
    setFoundUser({ user_id: "", username: "", avatar_url: "" });
    dispatch(setResult_addFriendRequest(""));

    let hasError = false;
    if (findById) {
      hasError = onSubmitCheck(idInput, setIdInput);
      console.log("hasError", hasError, idError);
      console.log(currentUser.user_id, idInput[inputNames.user_ID]);
      if (currentUser.user_id === idInput[inputNames.user_ID]) {
        setErrorMsg("You cannot add yourself as a friend.....");
        hasError = true;
      }
    } else {
      hasError = onSubmitCheck(emailInput, setEmailError);
      if (currentUser.email === emailInput[inputNames.email]) {
        setErrorMsg("You cannot add yourself as a friend.....");
        hasError = true;
      }
    }
    if (hasError) return;

    try {
      const { data } = await client.post<
        { user_id: string; username: string; avatar_url: string }[]
      >(serverUrl + `/user/search-user`, {
        user_id: idInput[inputNames.user_ID],
        user_email: emailInput[inputNames.email],
      });

      if (data.length === 0) {
        setErrorMsg("This user does not exist in our record.");
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
      <div className={styles.title}>Add a Friend</div>
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
          {findById ? (
            <InputField
              inputName={inputNames.user_ID}
              inputValue={idInput[inputNames.user_ID]}
              inputError={idError[inputNames.user_ID]}
              requestError=""
              setInputValues={setIdInput}
              setInputErrors={setIdError}
              size={inputFieldSizes.medium}
            />
          ) : (
            <InputField
              inputName={inputNames.email}
              inputValue={emailInput[inputNames.email]}
              inputError={emailError[inputNames.email]}
              requestError=""
              setInputValues={setEmailInput}
              setInputErrors={setEmailError}
              size={inputFieldSizes.medium}
            />
          )}
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
