import { memo } from "react";

import { GroupMember } from "../../redux/user/userSlice";

// UI //
import styles from "./MembersListAvatars.module.css";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

interface Props {
  group_members: GroupMember[] | undefined;
  user_left: boolean;
}

function MembersListAvatars({ group_members, user_left }: Props): JSX.Element {
  return (
    <>
      {group_members && !user_left && (
        <AvatarGroup max={4}>
          {group_members.map((member) => {
            const { avatar_url, username, user_id } = member;
            return (
              <Avatar
                key={user_id}
                alt={username[0]}
                src={avatar_url ? avatar_url : username[0]}
                className={styles.avatar}
              />
            );
          })}
        </AvatarGroup>
      )}
    </>
  );
}

export default memo(MembersListAvatars);
