import { ChangeEvent, MouseEvent, FormEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectCurrentUser,
  selectFriendsList,
  selectResult_addFriendRequest,
  setResult_addFriendRequest,
} from "../../redux/user/userSlice";
import { client, serverUrl } from "../../redux/utils";
import { addFriendRequest_emitter } from "../../socket-io/emitters";
import { inputNames, onSubmitCheck } from "../../utils";
import InputField, {
  InputErrors,
  InputValues,
} from "../input-field/InputField";

// UI //
import styles from "./SearchUser.module.css";
import { Button } from "@mui/material";

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
  }>({ user_id: "", username: "" });
  const [isFound, setIsFound] = useState<boolean>(false);
  const [findById, setFindById] = useState<boolean>(true);
  const [message, setMesssage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function setMessageHandler(e: ChangeEvent<HTMLInputElement>) {
    setMesssage(e.target.value);
  }

  async function submitSearchHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    setErrorMsg("");
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
        { user_id: string; username: string }[]
      >(serverUrl + `/user/search-user`, {
        user_id: idValue.User_ID,
        user_email: emailValue[inputNames.email],
      });

      console.log(data);
      if (data.length === 0) {
        setFoundUser({ user_id: "", username: "Not Found" });
        setIsFound(false);
      } else {
        setFoundUser({ ...data[0] });
        setIsFound(true);
        if (friendsList[data[0].user_id] !== undefined) {
          console.log("This user is your friend already.");
          setErrorMsg("This user is your friend already.");
        }
      }
    } catch (err: any) {
      console.log(err.response.data.errors);
    }
  }

  function toggleFindById() {
    setFindById((prev) => !prev);
  }

  function addFriendRequestHandler() {
    // send request to target user. If user is online, he can see the request immediately
    // If target user is not online, save the request to DB, so he can get the request
    // notification next time he signs in
    if (message === "") {
      console.log("message is empty");
      return;
    }

    const { user_id, username, email } = currentUser;
    if (socket) {
      addFriendRequest_emitter(socket, {
        sender_id: user_id,
        sender_username: username,
        sender_email: email,
        message,
        target_id: foundUser.user_id,
      });
    }
  }
  function cancelAddFriendHandler() {
    dispatch(setResult_addFriendRequest(""));
    setFoundUser({ user_id: "", username: "" });
    setIsFound(false);
  }

  return (
    <main className={styles.main}>
      <h1>Search friend</h1>
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
                    // customStyle={customStyleOptions.create_new_group}
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
                    // customStyle={customStyleOptions.create_new_group}
                  />
                );
              })}
        </div>
        <div className={styles.buttons_wrapper}>
          <div onClick={toggleFindById} className={styles.find_by}>
            {findById ? "Find by user email?" : "Find by user ID?"}
          </div>
          <Button
            type="submit"
            variant="outlined"
            className={styles.button}
            onClick={submitSearchHandler}
          >
            Search
          </Button>
        </div>
      </form>

      {isFound && friendsList[foundUser.user_id] === undefined && (
        <h4>
          User Found: {foundUser.username}
          <span>
            <button onClick={addFriendRequestHandler}>Add Friend</button>
            <button onClick={cancelAddFriendHandler}>cancel</button>
            <input type="text" value={message} onChange={setMessageHandler} />
          </span>
        </h4>
      )}
      <div>{errorMsg}</div>
      <div>Result: {result_addFriendRequest}</div>
    </main>
  );
}

export default memo(SearchUser);

// <div>
//   <label>find by user Email</label>
//   <input
//     type="text"
//     name="email"
//     value={userEmail}
//     onChange={inputChangeHanlder}
//   />
//   <input type="submit" />
//   <button onClick={toggleFindById}>find by user id</button>
// </div>
