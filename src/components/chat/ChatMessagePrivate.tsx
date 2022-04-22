import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { MessageObject, msgType } from "../../redux/message/messageSlice";
import {
  CurrentUser,
  Friend,
  setOpenViewProfileModal,
  setViewProfileTarget,
} from "../../redux/user/userSlice";
import { FileIcons, getFileIcon } from "../../utils";
import ChatTimeline from "./ChatTimeline";
import { RenderAvatar } from "./ChatMessageGroup";

// UI //
import styles from "./ChatMessage.module.css";
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";

const fileIcons: FileIcons = {
  txt: txt_icon,
  doc: docx_icon,
  pdf: pdf_icon,
  ppt: pptx_icon,
  xls: xlsx_icon,
};

interface Props {
  message: MessageObject;
  targetFriend: Friend;
  currentUser: CurrentUser;
  next_created_at: string;
  currentTime: Date;
}

const cloudFrontUrl = process.env.REACT_APP_AWS_CLOUD_FRONT_URL;

function ChatMessagePrivate({
  message,
  targetFriend,
  currentUser,
  next_created_at,
  currentTime,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    user_id: currentUserId,
    avatar_url: avatar_self,
    username,
  } = currentUser;

  const {
    avatar_url: avatar_friend,
    friend_id,
    friend_email,
    friend_username,
    friend_display_name,
  } = targetFriend;

  const { msg_body, msg_type, file_localUrl, file_type, file_url, created_at } =
    message;

  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    setDisplayName(() => {
      if (!friend_display_name) {
        return friend_username;
      } else {
        return friend_display_name;
      }
    });
  }, [friend_display_name, friend_username]);

  function viewUserProfileHandler() {
    dispatch(setOpenViewProfileModal(true));
    dispatch(
      setViewProfileTarget({
        email: friend_email,
        user_id: friend_id,
        avatar_url: avatar_friend,
        username: friend_username,
      })
    );
  }
  function viewSelfProfileHandler() {
    navigate("/profile");
  }

  const folder = "users";
  const folder_id = currentUserId;

  let isSelf = false;
  let s_wrapper = styles.msg_wrapper;
  let s_body = styles.msg_body;
  let s_body_tip = styles.msg_body_tip;
  let s_content = styles.msg_content + " " + styles.msg_body_color;
  if (message.sender_id === currentUserId) {
    isSelf = true;
    s_wrapper = styles.msg_wrapper_yourself;
    s_body = styles.msg_body_yourself;
    s_body_tip = styles.msg_body_tip_yourself;
    s_content = styles.msg_content + " " + styles.msg_body_color_yourself;
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
                className={styles.avatar}
                avatar_url={avatar_friend}
                member_name={displayName}
                viewProfileHandler={viewUserProfileHandler}
              />
            )}

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

            {isSelf && (
              <RenderAvatar
                className={styles.avatar}
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

export default memo(ChatMessagePrivate);
