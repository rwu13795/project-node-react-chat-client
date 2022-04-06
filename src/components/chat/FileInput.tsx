import { ChangeEvent, FormEvent, memo, useState } from "react";

interface Props {}

const fileExtensions = [
  "pdf",
  "txt",
  "doc",
  "docx",
  "docm",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
];

function FileInput(): JSX.Element {
  // const dispatch = useDispatch();

  // const currentUserId = useSelector(selectUserId);
  // const currentUsername = useSelector(selectUsername);
  // const targetChatRoom = useSelector(selectTargetChatRoom);
  // const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  // const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [file, setFile] = useState<File | undefined>();
  const [sizeExceeded, setSizeExceeded] = useState<boolean>(false);
  const [notSupported, setNotSupported] = useState<boolean>(false);

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

    // check if the user was kicked out of the group or blocked by a friend
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

  const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile = e.target.files[0] as File;

      console.log(newFile);

      // 5 MB max size
      if (newFile.size > 5000000) {
        setSizeExceeded(true);
        return;
      }
      // if (!newFile.includes(newFile.type)) {
      //   setNotSupported(true);
      //   return;
      // }
      setFile(newFile);
    }
  };

  return (
    <main>
      <form onSubmit={sendImageHandler}>
        <input onChange={onFileChangeHandler} type="file" accept="*" />
        <input type="submit" />
      </form>
    </main>
  );
}

export default memo(FileInput);
