import { ChangeEvent, FormEvent, memo, useState } from "react";
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

interface Props {
  socket: Socket | undefined;
}

function SearchUser({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const friendsList = useSelector(selectFriendsList);
  const currentUser = useSelector(selectCurrentUser);
  const result_addFriendRequest = useSelector(selectResult_addFriendRequest);

  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [foundUser, setFoundUser] = useState<{
    user_id: string;
    username: string;
    found: boolean;
  }>({ user_id: "", username: "", found: false });
  const [findById, setFindById] = useState<boolean>(true);
  const [message, setMesssage] = useState<string>("");

  function inputChangeHanlder(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "id") {
      setUserId(value);
    } else {
      setUserEmail(value);
    }
  }
  function setMessageHandler(e: ChangeEvent<HTMLInputElement>) {
    setMesssage(e.target.value);
  }
  async function submitSearchHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(setResult_addFriendRequest(""));

    if (userEmail === "" && userId === "") return;

    if (userId === currentUser.user_id.toString()) {
      setFoundUser({
        user_id: "",
        username: "You cannot add yourself as friend!",
        found: false,
      });
      return;
    }
    try {
      const { data } = await client.post<
        { user_id: string; username: string }[]
      >(serverUrl + `/user/search-user`, {
        user_id: userId,
        user_email: userEmail,
      });
      console.log(data);
      if (data.length === 0) {
        setFoundUser({ user_id: "", username: "Not Found", found: false });
      } else {
        setFoundUser({ ...data[0], found: true });
      }
    } catch (err: any) {
      console.log(err.response.data.errors);
    }
  }

  function toggleFindById() {
    if (findById) {
      setUserId("");
    } else {
      setUserEmail("");
    }
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
      addFriendRequest_emitter({
        socket,
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
    setFoundUser({ user_id: "", username: "", found: false });
  }

  return (
    <main>
      <h4>Search User</h4>
      <form onSubmit={submitSearchHandler}>
        {findById && (
          <div>
            <label>find by user id</label>
            <input
              type="text"
              name="id"
              value={userId}
              onChange={inputChangeHanlder}
            />
            <input type="submit" />
            <button onClick={toggleFindById}>find by user Email</button>
          </div>
        )}
        {!findById && (
          <div>
            <label>find by user Email</label>
            <input
              type="text"
              name="email"
              value={userEmail}
              onChange={inputChangeHanlder}
            />
            <input type="submit" />
            <button onClick={toggleFindById}>find by user id</button>
          </div>
        )}
      </form>

      <h4>
        User Found: {foundUser.username}
        {friendsList[foundUser.user_id] !== undefined &&
          " This user is your friend already"}
        {friendsList[foundUser.user_id] === undefined && foundUser.found && (
          <span>
            <button onClick={addFriendRequestHandler}>Add Friend</button>
            <button onClick={cancelAddFriendHandler}>cancel</button>
            <input type="text" value={message} onChange={setMessageHandler} />
          </span>
        )}
      </h4>

      <div>Result: {result_addFriendRequest}</div>
    </main>
  );
}

export default memo(SearchUser);
