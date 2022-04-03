import { memo } from "react";

import { GroupMember } from "../../redux/user/userSlice";

// UI //
import styles from "./MembersListAvatars.module.css";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

interface Props {
  group_members: GroupMember[] | undefined;
}

function MembersListAvatars({ group_members }: Props): JSX.Element {
  return (
    <>
      {group_members && (
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
