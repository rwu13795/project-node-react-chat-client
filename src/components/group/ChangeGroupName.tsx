import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import { inputNames, loadingStatusEnum, onSubmitCheck } from "../../utils";
import InputField, {
  inputFieldStyles,
  InputFields,
} from "../input-field/InputField";
import { changeGroupName } from "../../redux/user/asyncThunk";

// UI //
import styles from "./ChangeGroupName.module.css";
import styles_2 from "../user/profile/UserProfile.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";

interface Props {
  group_name: string;
  group_id: string;
  isAdmin: boolean;
}

function ChangeGroupName({
  group_name,
  group_id,
  isAdmin,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [inputValues, setInputValues] = useState<InputFields>({});
  const [inputErrors, setInputErrors] = useState<InputFields>({});
  const [editing, setEditing] = useState<boolean>(false);

  // have to initialize the inputValues in useEffect since the username is not loaded
  // by the useSelector when the component is mounted.
  useEffect(() => {
    if (group_name !== undefined) {
      setInputValues({ [inputNames.new_group_name]: group_name });
      setInputErrors({ [inputNames.new_group_name]: "" });
    }
  }, [group_name]);

  useEffect(() => {
    if (loading === loadingStatusEnum.succeeded) {
      toggleEditing();
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [loading, dispatch]);

  function toggleEditing() {
    setEditing((prev) => !prev);
  }
  function editUsernameHandler() {
    if (group_name === inputValues[inputNames.new_group_name]) {
      toggleEditing();
      return;
    }

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      changeGroupName({
        new_group_name: inputValues[inputNames.new_group_name],
        group_id,
      })
    );
  }

  return (
    <main className={styles.main}>
      {inputValues[inputNames.new_group_name] !== undefined &&
        (isAdmin ? (
          <>
            {editing ? (
              <div className={styles.text_button_wrapper}>
                <InputField
                  inputName={inputNames.new_group_name}
                  inputValue={inputValues[inputNames.new_group_name]}
                  inputError={inputErrors[inputNames.new_group_name]}
                  requestError={requestErrors[inputNames.new_group_name]}
                  setInputValues={setInputValues}
                  setInputErrors={setInputErrors}
                  customStyle={inputFieldStyles.change_group_name}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles_2.edit_button}
                  onClick={editUsernameHandler}
                >
                  <SaveIcon fontSize="small" />
                  Save
                </Button>
              </div>
            ) : (
              <div className={styles.text_button_wrapper}>
                <div id="main_title_2">{group_name}</div>
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles_2.edit_button}
                  onClick={toggleEditing}
                >
                  <EditIcon fontSize="small" />
                  Edit
                </Button>
              </div>
            )}
          </>
        ) : (
          <div id="main_title_2">{group_name}</div>
        ))}
    </main>
  );
}

export default memo(ChangeGroupName);
