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
import { serverUrl } from "../../redux/utils";
import { addFriendRequest_emitter } from "../../socket-io/emitters";
import {
  AxiosClient,
  inputFieldSizes,
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
} from "../../utils";
import InputField, { InputFields } from "../input-field/InputField";
import SearchFound from "./SearchFound";
import RenderFriend from "../menu/left/RenderFriend";

// UI //
import styles from "./SearchUser.module.css";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface FoundUser {
  user_id: string;
  username: string;
  avatar_url: string;
}

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
  handleCloseModal: () => void;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchUser({
  socket,
  selectTargetChatRoomHandler,
  handleCloseModal,
  setExpand,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const client = AxiosClient.getClient();

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

  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [findById, setFindById] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    return () => {
      dispatch(setResult_addFriendRequest(""));
    };
  }, []);

  async function submitSearchHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    setErrorMsg("");
    setFoundUser(null);

    dispatch(setResult_addFriendRequest(""));

    let hasError = false;
    if (findById) {
      hasError = onSubmitCheck(idInput, setIdInput);

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
      const { data } = await client.post<FoundUser[]>(
        serverUrl + `/user/search-user`,
        {
          user_id: idInput[inputNames.user_ID],
          user_email: emailInput[inputNames.email],
        }
      );

      if (data.length === 0) {
        setErrorMsg("This user does not exist in our record.");
      } else {
        setFoundUser({ ...data[0] });

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
    if (socket && foundUser) {
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

  function clickFoundFriendHandler() {
    setExpand(true);
    handleCloseModal();
  }

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

      {foundUser && friendsList[foundUser.user_id] === undefined && (
        <SearchFound
          username={foundUser.username}
          avatar_url={foundUser.avatar_url}
          addFriendRequestHandler={addFriendRequestHandler}
        />
      )}
      <div className={styles.error_text}>{errorMsg}</div>
      {foundUser && friendsList[foundUser.user_id] !== undefined && (
        <div onClick={clickFoundFriendHandler} className={styles.found_friend}>
          <RenderFriend
            friend={{
              friend_id: foundUser.user_id,
              friend_username: foundUser.username,
              friend_email: "",
              avatar_url: foundUser.avatar_url,
              user_blocked_friend: false,
              user_blocked_friend_at: "",
              friend_blocked_user: false,
              friend_blocked_user_at: "",
              onlineStatus: "",
            }}
            socket={socket}
            selectTargetChatRoomHandler={selectTargetChatRoomHandler}
            showStatus={false}
            notificationCount={0}
          />
        </div>
      )}
      <div className={styles.error_text}>{result_addFriendRequest}</div>
    </main>
  );
}

export default memo(SearchUser);
