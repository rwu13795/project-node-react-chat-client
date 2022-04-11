import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ViewUserProfile from "../user/profile/ViewUserProfile";
import { MessageObject, msgType } from "../../redux/message/messageSlice";
import { FileIcons, getFileIcon } from "../../utils";

// UI //
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";
import styles from "./ChatMessage.module.css";
import { Avatar } from "@mui/material";
import {
  CurrentUser,
  GroupMember,
  selectCurrentUser,
  selectTargetGroup,
} from "../../redux/user/userSlice";
import ChatTimeline from "./ChatTimeline";

const fileIcons: FileIcons = {
  txt: txt_icon,
  doc: docx_icon,
  pdf: pdf_icon,
  ppt: pptx_icon,
  xls: xlsx_icon,
};

interface Props {
  message: MessageObject;
  group_id: string;
  targetGroupMembers: { [member_id: string]: GroupMember };
  currentUser: CurrentUser;
  next_created_at: string;
  currentTime: Date;
}

const cloudFrontUrl = process.env.REACT_APP_AWS_CLOUD_FRONT_URL;

function ChatMessageGroup({
  message,
  group_id,
  targetGroupMembers,
  currentUser,
  next_created_at,
  currentTime,
}: Props): JSX.Element {
  const navigate = useNavigate();

  const {
    user_id: currentUserId,
    username,
    avatar_url: avatar_self,
  } = currentUser;
  const {
    sender_id,
    msg_body,
    msg_type,
    file_localUrl,
    file_type,
    file_url,
    created_at,
  } = message;
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  function closeProfileHandler() {
    setOpenProfile(false);
  }
  function viewUserProfileHandler() {
    setOpenProfile(true);
  }
  function viewSelfProfileHandler() {
    navigate("/profile");
  }

  let member_name = "";
  let avatar_member = undefined;
  let member_email = "";
  let member_id = "";
  if (targetGroupMembers[sender_id]) {
    member_name = targetGroupMembers[sender_id].username;
    avatar_member = targetGroupMembers[sender_id].avatar_url;
    member_email = targetGroupMembers[sender_id].email;
    member_id = targetGroupMembers[sender_id].user_id;
  }

  const folder = "groups";
  const folder_id = group_id;

  let isSelf = false;
  let s_wrapper = styles.msg_wrapper;
  let s_body = styles.msg_body;
  let s_body_tip = styles.msg_body_tip;
  let s_content = styles.msg_content + " " + styles.msg_body_color;
  let member_name_content =
    styles.member_name_content_wrapper + " " + styles.align_left;
  if (message.sender_id === currentUserId) {
    isSelf = true;
    s_wrapper = styles.msg_wrapper_yourself;
    s_body = styles.msg_body_yourself;
    s_body_tip = styles.msg_body_tip_yourself;
    s_content = styles.msg_content + " " + styles.msg_body_color_yourself;
    member_name_content =
      styles.member_name_content_wrapper + " " + styles.align_right;
  }

  console.log("member_id", member_id);

  return (
    <main className={styles.msg_container}>
      {msg_type === msgType.admin ? (
        <div className={styles.notification}>
          <div style={{ fontWeight: "bold" }}>Notification</div>
          <div>{msg_body}</div>
        </div>
      ) : (
        <>
          <ChatTimeline
            currentTime={currentTime}
            created_at={created_at}
            next_created_at={next_created_at}
          />
          <div className={s_wrapper}>
            {!isSelf && (
              <Avatar
                className={styles.avatar_member}
                src={avatar_member ? avatar_member : member_name[0]}
                alt={member_name[0]}
                onClick={member_id === "" ? () => {} : viewUserProfileHandler}
              />
            )}
            <div className={member_name_content}>
              <div className={styles.member_name}>
                {member_id === ""
                  ? "this member has left the group"
                  : member_name}
              </div>
              <div className={s_body}>
                {!isSelf && <div className={s_body_tip}></div>}
                <div className={s_content}>
                  {msg_body !== "" && (
                    <div className={styles.text_wrapper}>{msg_body}</div>
                  )}
                  {msg_type === msgType.image && (
                    <img
                      className={styles.image_wrapper}
                      alt="expired"
                      src={
                        file_localUrl
                          ? file_localUrl
                          : `${cloudFrontUrl}/${folder}/${folder_id}/${file_url}`
                      }
                    />
                  )}
                  {msg_type === msgType.file &&
                    (file_url ? (
                      <a
                        href={`${cloudFrontUrl}/${folder}/${folder_id}/${file_url}`}
                      >
                        <img
                          className={styles.file_wrapper}
                          src={getFileIcon(fileIcons, file_type)}
                          alt="file_icon"
                        />
                      </a>
                    ) : (
                      <img
                        className={styles.file_wrapper}
                        src={getFileIcon(fileIcons, file_type)}
                        alt="file_icon"
                      />
                    ))}
                </div>
                {isSelf && <div className={s_body_tip}></div>}
              </div>
            </div>

            {isSelf && (
              <Avatar
                className={styles.avatar_member}
                src={avatar_self ? avatar_self : username[0]}
                alt={username[0]}
                onClick={viewSelfProfileHandler}
              />
            )}
          </div>
        </>
      )}

      {/* have to use margin instead of gap to seperate the timeline and body since the 
        modal is counted as an inline element here, the gap will also be applied to it */}
      <ViewUserProfile
        openModal={openProfile}
        user_id={member_id}
        username={member_name}
        email={member_email}
        avatar_url={avatar_member}
        closeModalHandler={closeProfileHandler}
      />
    </main>
  );
}

export default memo(ChatMessageGroup);
