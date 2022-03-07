import { ChangeEvent, FormEvent, memo, useState } from "react";
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

interface Props {
  socket: Socket | undefined;
}

function ImageInput({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [imageFile, setImageFile] = useState<File>();

  function sendImageHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_name: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_name: targetChatRoom.name,
      msg_body: "",
      msg_type: "image",
      file_localUrl: imageFile ? URL.createObjectURL(imageFile) : "",
      file_name: imageFile ? imageFile.name : "",
      created_at: new Date().toString(),
    };

    // check if the user was kicked out of the group or blocked by a friend
    if (targetChatRoom.type === chatType.group) {
      if (targetGroup && targetGroup.user_left) return;
    } else {
      if (
        targetFriend &&
        (targetFriend.friend_blocked_user || targetFriend.user_blocked_friend)
      )
        return;
    }

    dispatch(
      addNewMessageToHistory_memory({
        messageObject,
        room_type: targetChatRoom.type,
      })
    );

    if (socket) {
      socket.emit("message-to-server", {
        messageObject: { ...messageObject, file_body: imageFile },
        room_type: targetChatRoom.type,
      });
    }

    // scroll to down to show the new message
    // let elem = document.getElementById("chat-board");
    // console.log("elem found !", elem);
    // setTimeout(() => {
    //   if (elem) {
    //     elem.scrollTo({
    //       top: elem.scrollHeight,
    //       behavior: "smooth",
    //     });
    //   }
    // }, 280);
  }

  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImage = e.target.files[0] as File;
      // check the extension of the file, if not txt, docx, pdf, don't let user send
      // check the type of the file, if it is not of image, don't let user send
      console.log(newImage.name.split(".")[1]);

      // check the size
      console.log("newImage size", newImage.size);

      setImageFile(newImage);
    }
  };

  return (
    <main>
      <h4>I am the Image Input</h4>
      <form onSubmit={sendImageHandler}>
        <input type="file" onChange={onImageChangeHandler} accept="image/*" />
        <input type="submit" />
      </form>
    </main>
  );
}

export default memo(ImageInput);
