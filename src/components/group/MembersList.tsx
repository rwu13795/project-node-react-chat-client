import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../redux/message/messageSlice";
import {
  selectCurrentUser,
  selectFriendsList,
  selectTargetGroup,
  selectUserId,
} from "../../redux/user/userSlice";
import KickMember from "./KickMember";

// UI //
import styles from "./MembersList.module.css";
import styles_2 from "../group/CreateGroup.module.css";
import styles_3 from "../user/profile/UserProfile.module.css";
import { Avatar, Button } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
}

function MembersList({ socket, setOpenMemberList }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const currentUser = useSelector(selectCurrentUser);
  const friendsList = useSelector(selectFriendsList);

  const { group_id, group_name, group_members, admin_user_id } = targetGroup;

  function handleCloseMemberList() {
    setOpenMemberList(false);
  }

  return (
    <main className={styles.main}>
      <div className={styles.close_icon_wrapper}>
        <CancelPresentationIcon
          className={styles.close_icon}
          onClick={handleCloseMemberList}
        />
      </div>

      {targetGroup && targetGroup.group_members && (
        <>
          <div className={styles.group_name_wrapper}>
            <div className={styles.title}>
              {group_name}
              {admin_user_id === currentUser.user_id && (
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles_3.edit_button}
                  // onClick={editUsernameHandler}
                >
                  <EditIcon fontSize="small" />
                  edit
                </Button>
              )}
            </div>
            <div className={styles_2.border}></div>
          </div>

          <div className={styles.list}>
            <div className={styles.sub_title}>Friends</div>
            <div className={styles.short_border}>
              <div className={styles_2.border}></div>
            </div>
            {targetGroup.group_members.map((member, index) => {
              const { user_id, avatar_url, username } = member;
              const isFriend = friendsList[user_id] !== undefined;
              return (
                <div key={index}>
                  {isFriend && (
                    <div>
                      <Avatar
                        src={avatar_url ? avatar_url : username[0]}
                        alt={username[0]}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.list}>
            <div className={styles.sub_title}>Other Members</div>
            <div className={styles.short_border}>
              <div className={styles_2.border}></div>
            </div>
            {targetGroup.group_members.map((member, index) => {
              return (
                <div key={index}>
                  Username: {member.username} @ID{member.user_id}
                  {targetGroup.admin_user_id === member.user_id && (
                    <span style={{ color: "red" }}>Group Admin</span>
                  )}
                  {currentUser.user_id === targetGroup.admin_user_id && (
                    <KickMember
                      socket={socket}
                      group_id={targetGroup.group_id}
                      member_user_id={member.user_id}
                      member_username={member.username}
                      currentUserId={currentUser.user_id}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {admin_user_id === currentUser.user_id && (
            <div className={styles.list}>
              <div className={styles.sub_title}>Administrator</div>
              <div className={styles.short_border}>
                <div className={styles_2.border}></div>
              </div>
              <div>
                <div>
                  <Avatar
                    src={
                      currentUser.avatar_url
                        ? currentUser.avatar_url
                        : currentUser.username[0]
                    }
                    alt={currentUser.username[0]}
                  />
                  <div>{currentUser.username}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default memo(MembersList);
