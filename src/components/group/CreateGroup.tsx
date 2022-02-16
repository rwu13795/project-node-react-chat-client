import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  selectCreateGroupError,
  selectUserId,
} from "../../redux/user/userSlice";

function CreateGroup(): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const createGroupError = useSelector(selectCreateGroupError);
  const [groupName, setGroupName] = useState<string>("");

  function setGroupNameHandler(e: ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
  }
  function createGroupHandler() {
    if (groupName === "") return;
    dispatch(
      createNewGroup({ group_name: groupName, creator_user_id: currentUserId })
    );
  }

  return (
    <main>
      <h3>I am the Create Group</h3>
      <div>
        <div>
          <label>group name</label>
          <input type="text" value={groupName} onChange={setGroupNameHandler} />
        </div>
      </div>
      <div>
        <button onClick={createGroupHandler} disabled={groupName === ""}>
          Create Group
        </button>
      </div>
      <div>{createGroupError}</div>
    </main>
  );
}

export default memo(CreateGroup);
