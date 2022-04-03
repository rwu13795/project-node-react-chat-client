import { MouseEvent, FormEvent, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { chatType } from "../../redux/message/messageSlice";
import { createNewGroup } from "../../redux/user/asyncThunk";
import {
  selectLoadingStatus_user,
  selectNewGroupToJoin,
  selectRequestErrors,
  selectUserId,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import {
  inputFieldSizes,
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
} from "../../utils";
import { createNewGroup_emitter } from "../../socket-io/emitters";
import { getNotifications } from "../../redux/message/asyncThunk";
import InputField, { InputFields } from "../input-field/InputField";

// UI //
import styles from "./CreateGroup.module.css";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
  handleCloseModal: () => void;
}

function CreateGroup({
  socket,
  selectTargetChatRoomHandler,
  handleCloseModal,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const newGroupToJoin = useSelector(selectNewGroupToJoin);
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const requestErrors = useSelector(selectRequestErrors);

  const [inputValues, setInputValues] = useState<InputFields>({
    [inputNames.new_group_name]: "",
  });
  const [inputErrors, setInputErrors] = useState<InputFields>({
    [inputNames.new_group_name]: "",
  });

  useEffect(() => {
    if (
      loadingStatus === loadingStatusEnum.createNewGroup_succeeded &&
      socket
    ) {
      dispatch(getNotifications({ currentUserId }));
      createNewGroup_emitter(socket, { group_id: newGroupToJoin });
      selectTargetChatRoomHandler(
        newGroupToJoin,
        inputValues[inputNames.new_group_name],
        chatType.group
      );
      handleCloseModal();
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [loadingStatus, newGroupToJoin]);

  function createGroupHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;
    dispatch(setLoadingStatus_user(loadingStatusEnum.createNewGroup_loading));
    dispatch(
      createNewGroup({
        group_name: inputValues[inputNames.new_group_name],
        admin_user_id: currentUserId,
      })
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>Create a New Group</div>
      <div className={styles.border}></div>
      <form onSubmit={createGroupHandler} style={{ marginTop: "20px" }}>
        <div className={styles.input_field}>
          {Object.entries(inputValues).map(([name, value]) => {
            return (
              <InputField
                key={name}
                inputName={name}
                inputValue={value}
                inputError={inputErrors[name]}
                requestError={requestErrors[name]}
                setInputValues={setInputValues}
                setInputErrors={setInputErrors}
                useMultiline={true}
                size={inputFieldSizes.medium}
                isDisabled={
                  loadingStatus ===
                    loadingStatusEnum.createNewGroup_succeeded ||
                  loadingStatus === loadingStatusEnum.createNewGroup_loading
                }
              />
            );
          })}
        </div>

        <LoadingButton
          type="submit"
          variant="outlined"
          className={styles.button}
          onClick={createGroupHandler}
          loading={loadingStatus === loadingStatusEnum.createNewGroup_loading}
          disabled={
            loadingStatus === loadingStatusEnum.createNewGroup_succeeded ||
            loadingStatus === loadingStatusEnum.createNewGroup_loading
          }
        >
          Create
        </LoadingButton>
      </form>

      <div className={styles.error_groups_limit}>
        {requestErrors[inputNames.groups_limit]}
      </div>
    </main>
  );
}

export default memo(CreateGroup);
