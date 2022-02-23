import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  chatType,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import MembersList from "../group/MembersList";
import RemoveGroup from "../group/RemoveGroup";

interface Props {
  socket: Socket | undefined;
}

function ChatRoomMenu({ socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const [openMembersList, setOpenMembersList] = useState<boolean>(false);

  function openMembersListHandler() {
    setOpenMembersList((prev) => !prev);
  }
  return (
    <main>
      <h1>Chat Room Menu</h1>
      {targetChatRoom.type === chatType.group && (
        <div>
          <button onClick={openMembersListHandler}>Members list</button>
          <RemoveGroup />
        </div>
      )}
      {openMembersList && <MembersList socket={socket} />}
    </main>
  );
}

export default memo(ChatRoomMenu);
