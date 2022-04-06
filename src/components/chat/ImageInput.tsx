import { ChangeEvent, FormEvent, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  chatType,
  MessageObject,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { message_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export const imageTypes = [
  "image/apng",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
];

function ImageInput({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [sizeExceeded, setSizeExceeded] = useState<boolean>(false);
  const [notSupported, setNotSupported] = useState<boolean>(false);

  useEffect(() => {
    //////////////
    const log = document.getElementById("chat-logs-container");
    const input = document.getElementById("input-container");
    const board = document.getElementById("chat-board-container");

    if (log && input && board) {
      setTimeout(() => {
        console.log("board.offsetHeight", board.offsetHeight);
        console.log("input.scrollHeight", input.scrollHeight);
        console.log("log.style.height", log.style.height);
        log.style.height = board.offsetHeight - input.scrollHeight + "px";
        console.log("log.style.height", log.style.height);
        // input.style.height = "auto";
      }, 100);
    }

    ///////////////
  });

  function sendImageHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // const messageObject: MessageObject = {
    //   sender_id: currentUserId,
    //   sender_name: currentUsername,
    //   recipient_id: targetChatRoom.id,
    //   recipient_name: targetChatRoom.name,
    //   msg_body: "",
    //   msg_type: "image",
    //   file_localUrl: imageFile ? URL.createObjectURL(imageFile) : "",
    //   file_name: imageFile ? imageFile.name : "",
    //   file_type: imageFile ? imageFile.type : "",
    //   created_at: new Date().toString(),
    // };

    // // check if the user was kicked out of the group or blocked by a friend
    // if (targetChatRoom.type === chatType.group) {
    //   if (targetGroup && targetGroup.user_left) return;
    // } else {
    //   if (
    //     targetFriend &&
    //     (targetFriend.friend_blocked_user || targetFriend.user_blocked_friend)
    //   )
    //     return;
    // }

    // dispatch(
    //   addNewMessageToHistory_memory({
    //     messageObject,
    //     room_type: targetChatRoom.type,
    //   })
    // );
    // if (socket) {
    //   message_emitter(socket, {
    //     messageObject: { ...messageObject, file_body: imageFile },
    //     room_type: targetChatRoom.type,
    //   });
    // }
  }

  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImage = e.target.files[0] as File;

      // 5 MB max size
      if (newImage.size > 5000000) {
        setSizeExceeded(true);
        return;
      }
      if (!imageTypes.includes(newImage.type)) {
        setNotSupported(true);
        return;
      }
      setImageFile(newImage);
    }
  };

  return (
    <main>
      <h4>I am the Image Input</h4>
      <form onSubmit={sendImageHandler}>
        <input
          onChange={onImageChangeHandler}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
        />
        <input type="submit" />
      </form>
      {/* <div style={{ maxWidth: "200px", maxHeight: "400px" }}>
        Preview: {sizeExceeded && "Size excceeds max size (5MB)"}
        {notSupported && "only png, jpeg, jpg, gif is supported"}
        {imageFile && (
          <img
            style={{ maxWidth: "200px", maxHeight: "400px" }}
            src={URL.createObjectURL(imageFile)}
            alt="preview"
          />
        )}
      </div> */}
      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="preview"
          style={{ maxWidth: "300px", maxHeight: "300px" }}
        />
      )}
    </main>
  );
}

export default memo(ImageInput);
