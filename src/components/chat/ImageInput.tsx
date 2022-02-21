import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  MessageObject,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
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
      file_localUrl: URL.createObjectURL(imageFile!),
      file_name: imageFile!.name,
      created_at: new Date().toDateString(),
    };

    dispatch(
      addNewMessageToHistory_memory({
        ...messageObject,
        targetChatRoom_type: targetChatRoom.type,
      })
    );
    if (targetGroup.user_kicked) return;

    if (socket) {
      socket.emit("messageToServer", {
        ...messageObject,
        file_body: imageFile,
        targetChatRoom_type: targetChatRoom.type,
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
      console.log(URL.createObjectURL(newImage));
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
