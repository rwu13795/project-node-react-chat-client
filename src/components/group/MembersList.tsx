import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../redux/message/messageSlice";
import {
  clearLeftMember,
  GroupMember,
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
import ViewUserProfile from "../user/profile/ViewUserProfile";
import { kickMember_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
}

function MembersList({ socket, setOpenMemberList }: Props): JSX.Element {
  const dispatch = useDispatch();

  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const currentUser = useSelector(selectCurrentUser);
  const friendsList = useSelector(selectFriendsList);

  const { group_id, group_name, group_members, admin_user_id } = targetGroup;
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [targetUser, setTargetUser] = useState<GroupMember>({
    user_id: "",
    username: "",
    email: "",
  });
  const [kicking, setKicking] = useState<boolean>(false);

  function openProfileHandler() {
    setOpenProfile(true);
  }
  function closeProfileHandler() {
    setOpenProfile(false);
  }

  function handleCloseMemberList() {
    setOpenMemberList(false);
  }
  function viewUserProfileHandler(member: GroupMember) {
    setTargetUser(member);
    openProfileHandler();
  }
  function kickMemberHandler(member_user_id: string, member_username: string) {
    console.log(member_user_id, member_username);
    if (socket) {
      kickMember_emitter(socket, { group_id, member_user_id, member_username });
    }
    dispatch(clearLeftMember({ group_id, member_user_id }));
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
      <ViewUserProfile
        openModal={openProfile}
        user_id={targetUser.user_id}
        username={targetUser.username}
        email={targetUser.email}
        avatar_url={targetUser.avatar_url}
        closeModalHandler={closeProfileHandler}
      />

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
                            onClick={() => viewUserProfileHandler(member)}
                          />
                          <div className={styles.username}>{username}</div>
                          {user_id === admin_user_id && (
                            <div className={styles.admin_tag}>Admin</div>
                          )}
                          {kicking && (
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                kickMemberHandler(user_id, username)
                              }
                            >
                              Kick
                            </Button>
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
                            onClick={() => viewUserProfileHandler(member)}
                          />
                          <div className={styles.username}>{username}</div>
                          {user_id === admin_user_id && (
                            <div className={styles.admin_tag}>Admin</div>
                          )}
                          {kicking && (
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                kickMemberHandler(user_id, username)
                              }
                            >
                              Kick
                            </Button>
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

            {group_members.length > 1 && (
              <Button
                variant="contained"
                color="error"
                className={styles.kick_button}
                onClick={() => setKicking(!kicking)}
              >
                {kicking ? "Cancel" : "Kick member"}
              </Button>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default memo(MembersList);
