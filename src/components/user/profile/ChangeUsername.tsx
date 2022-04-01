import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCurrentUser,
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../../redux/user/userSlice";
import { inputNames, loadingStatusEnum, onSubmitCheck } from "../../../utils";
import InputField, {
  inputFieldStyles,
  InputFields,
} from "../../input-field/InputField";
import { changeUsername } from "../../../redux/user/asyncThunk";

// UI //
import styles from "./ChangeUsername.module.css";
import styles_2 from "./UserProfile.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";

interface Props {
  username: string;
}

function ChangeUsername({ username }: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [inputValues, setInputValues] = useState<InputFields>({});
  const [inputErrors, setInputErrors] = useState<InputFields>({});
  const [editing, setEditing] = useState<boolean>(false);

  // have to initialize the inputValues in useEffect since the username is not loaded
  // by the useSelector when the component is mounted.
  useEffect(() => {
    if (username !== undefined) {
      setInputValues({ [inputNames.username]: username });
      setInputErrors({ [inputNames.username]: "" });
    }
  }, [username]);

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
    if (username === inputValues[inputNames.username]) {
      toggleEditing();
      return;
    }

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      changeUsername({
        username: inputValues[inputNames.username],
      })
    );
  }

  return (
    <main className={styles.main}>
      {inputValues[inputNames.username] !== undefined && (
        <>
          {editing ? (
            <>
              <InputField
                inputName={inputNames.username}
                inputValue={inputValues[inputNames.username]}
                inputError={inputErrors[inputNames.username]}
                requestError={requestErrors[inputNames.username]}
                setInputValues={setInputValues}
                setInputErrors={setInputErrors}
                customStyle={inputFieldStyles.change_user_name}
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
            </>
          ) : (
            <>
              <div className={styles.text_button_wrapper}>
                {username}
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
            </>
          )}
        </>
      )}
    </main>
  );
}

export default memo(ChangeUsername);
