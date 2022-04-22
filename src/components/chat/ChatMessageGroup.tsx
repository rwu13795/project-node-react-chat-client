import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { MessageObject, msgType } from "../../redux/message/messageSlice";
import { FileIcons, getFileIcon } from "../../utils";
import {
  CurrentUser,
  setOpenViewProfileModal,
  setViewProfileTarget,
} from "../../redux/user/userSlice";
import ChatTimeline from "./ChatTimeline";

// UI //
import styles from "./ChatMessage.module.css";
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";
import { Avatar } from "@mui/material";

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
  friend_display_name: string;
  member_name: string;
  avatar_member: string | undefined;
  member_email: string;
  member_id: string;
  currentUser: CurrentUser;
  next_created_at: string;
  currentTime: Date;
}

const cloudFrontUrl = process.env.REACT_APP_AWS_CLOUD_FRONT_URL;

function ChatMessageGroup({
  message,
  group_id,
  friend_display_name,
  member_name,
  avatar_member,
  member_email,
  member_id,
  currentUser,
  next_created_at,
  currentTime,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    user_id: currentUserId,
    username,
    avatar_url: avatar_self,
  } = currentUser;
  const { msg_body, msg_type, file_localUrl, file_type, file_url, created_at } =
    message;
  const displayName =
    friend_display_name !== "" ? friend_display_name : member_name;

  function viewUserProfileHandler() {
    dispatch(setOpenViewProfileModal(true));
    dispatch(
      setViewProfileTarget({
        email: member_email,
        user_id: member_id,
        avatar_url: avatar_member,
        username: member_name,
      })
    );
  }
  function viewSelfProfileHandler() {
    navigate("/profile");
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
              <RenderAvatar
                className={styles.avatar_member}
                avatar_url={avatar_member}
                member_name={displayName}
                viewProfileHandler={viewUserProfileHandler}
              />
            )}
            <div className={member_name_content}>
              <div className={styles.member_name}>
                {member_id === ""
                  ? "this member has left the group"
                  : displayName}
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
              <RenderAvatar
                className={styles.avatar_member}
                avatar_url={avatar_self}
                member_name={username}
                viewProfileHandler={viewSelfProfileHandler}
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default memo(ChatMessageGroup);

// since the properties of the avatar stay the same
// use memo to wrap the "avatar" to prevent unneccessary re-rendering
export const RenderAvatar = memo(RenderAvatarHanlder);

interface AvatarProps {
  className: string;
  avatar_url: string | undefined;
  member_name: string;
  viewProfileHandler: () => void;
}
function RenderAvatarHanlder({
  className,
  avatar_url,
  member_name,
  viewProfileHandler,
}: AvatarProps): JSX.Element {
  const avatar_src = avatar_url ? avatar_url : member_name[0];
  return (
    <Avatar
      className={className}
      src={avatar_src}
      alt={member_name[0]}
      onClick={viewProfileHandler}
    />
  );
}
