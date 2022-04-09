import { memo } from "react";
import { useSelector } from "react-redux";
import { chatType, MessageObject } from "../../redux/message/messageSlice";
import {
  selectCurrentUser,
  selectTargetFriend,
} from "../../redux/user/userSlice";
import { FileIcons, getFileIcon } from "../../utils";

// UI //
import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";
import styles from "./ChatMessage.module.css";
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
  targetId: string;
}

function ChatMessagePrivate({ message, targetId }: Props): JSX.Element {
  const {
    user_id: currentUserId,
    username,
    avatar_url: avatar_self,
  } = useSelector(selectCurrentUser);
  const { avatar_url: avatar_friend, friend_username } = useSelector(
    selectTargetFriend(targetId)
  );

  const {
    sender_id,
    msg_body,
    msg_type,
    file_localUrl,
    file_name,
    file_type,
    file_url,
    created_at,
  } = message;

  let folder = "users";
  let folder_id = currentUserId; // the private folder of the current user
  // if (targetChatRoom.type === chatType.group) {
  //   folder = "groups";
  //   folder_id = targetChatRoom.id;
  // }
  let isSelf = false;
  let s_wrapper = styles.msg_wrapper;
  let s_body = styles.msg_body;
  let s_content = styles.msg_content_private + " " + styles.msg_body_color;
  if (message.sender_id === currentUserId) {
    isSelf = true;
    s_wrapper = styles.msg_wrapper_yourself;
    s_body = styles.msg_body_yourself;
    s_content =
      styles.msg_content_private + " " + styles.msg_body_color_yourself;
  }

  return (
    <main className={styles.msg_container}>
      <div className={styles.time_line}>{created_at}</div>
      <div className={s_wrapper}>
        {!isSelf && (
          <div className={styles.avatar}>
            <Avatar
              src={avatar_friend ? avatar_friend : friend_username[0]}
              alt={friend_username[0]}
            />
          </div>
        )}

        <div className={s_body}>
          {!isSelf && <div className={styles.msg_body_tip}>a</div>}
          <div className={s_content}>
            <div>{msg_body}</div>
            {msg_type === "image" && (
              <div>
                <img
                  alt="tesing"
                  src={
                    file_localUrl
                      ? file_localUrl
                      : `https://d229fmuzhn8qxo.cloudfront.net/${folder}/${folder_id}/${file_url}`
                  }
                />
              </div>
            )}
            {msg_type === "file" && (
              <div>
                {file_url ? (
                  <a
                    href={`https://d229fmuzhn8qxo.cloudfront.net/${folder}/${folder_id}/${file_url}`}
                  >
                    Link to file
                    <img
                      src={getFileIcon(fileIcons, file_type)}
                      alt="file_icon"
                    />
                  </a>
                ) : (
                  <img
                    src={getFileIcon(fileIcons, file_type)}
                    alt="file_icon"
                  />
                )}
              </div>
            )}
          </div>
          {isSelf && <div className={styles.msg_body_tip}>a</div>}
        </div>

        {isSelf && (
          <div className={styles.avatar}>
            <Avatar
              src={avatar_self ? avatar_self : username[0]}
              alt={username[0]}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default memo(ChatMessagePrivate);
