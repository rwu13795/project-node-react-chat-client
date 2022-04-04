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
import ChangeGroupName from "./ChangeGroupName";

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
    <>
      {/* the close icon is stick to the "slide", not the "memberList" */}
      <div className={styles.close_icon_wrapper}>
        <CancelPresentationIcon
          className={styles.close_icon}
          onClick={handleCloseMemberList}
        />
      </div>
      <main className={styles.main}>
        {targetGroup && group_members && (
          <>
            <div className={styles.group_name_wrapper}>
              <ChangeGroupName
                isAdmin={currentUser.user_id === admin_user_id}
                group_id={group_id}
                group_name={group_name}
              />
              <div className={styles_2.border}></div>
            </div>

            <div className={styles.list}>
              <div className={styles.sub_title}>Friends</div>
              <div className={styles.short_border}></div>
              <div className={styles.list_body}>
                {group_members.map((member, index) => {
                  const { user_id, avatar_url, username } = member;
                  const isFriend = friendsList[user_id] !== undefined;
                  return (
                    <div
                      key={index}
                      className={isFriend ? styles.member_wrapper : ""}
                    >
                      {isFriend && (
                        <>
                          <Avatar
                            src={avatar_url ? avatar_url : username[0]}
                            alt={username[0]}
                            className={styles.avatar}
                          />
                          <div className={styles.username}>{username}</div>
                          {user_id === admin_user_id && (
                            <div className={styles.admin_tag}>Admin</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.list}>
              <div className={styles.sub_title}>Other Members</div>
              <div className={styles.short_border}></div>
              <div className={styles.list_body}>
                {group_members.map((member, index) => {
                  const { user_id, avatar_url, username } = member;
                  const notFriend =
                    friendsList[user_id] === undefined &&
                    user_id !== currentUser.user_id;
                  return (
                    <div
                      key={index}
                      className={notFriend ? styles.member_wrapper : ""}
                    >
                      {notFriend && (
                        <>
                          <Avatar
                            src={avatar_url ? avatar_url : username[0]}
                            alt={username[0]}
                            className={styles.avatar}
                          />
                          <div className={styles.username}>{username}</div>
                          {user_id === admin_user_id && (
                            <div className={styles.admin_tag}>Admin</div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.list}>
              <div className={styles.sub_title}>You</div>
              <div className={styles.short_border}></div>
              <div className={styles.list_body}>
                <div className={styles.member_wrapper}>
                  <Avatar
                    src={
                      currentUser.avatar_url
                        ? currentUser.avatar_url
                        : currentUser.username[0]
                    }
                    alt={currentUser.username[0]}
                    className={styles.avatar}
                  />
                  <div className={styles.username}>{currentUser.username}</div>
                  {currentUser.user_id === admin_user_id && (
                    <div className={styles.admin_tag}>Admin</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default memo(MembersList);
