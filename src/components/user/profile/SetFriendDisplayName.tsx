import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectRequestErrors } from "../../../redux/user/userSlice";
import { inputNames, onSubmitCheck } from "../../../utils";
import InputField, {
  inputFieldStyles,
  InputFields,
} from "../../input-field/InputField";
import { setFriendDisplayName } from "../../../redux/user/asyncThunk";

// UI //
import styles from "./ChangeUsername.module.css";
import styles_2 from "./UserProfile.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";

interface Props {
  friend_id: string;
  friend_display_name?: string;
}

function SetFriendDisplayName({
  friend_id,
  friend_display_name,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);

  const [inputValues, setInputValues] = useState<InputFields>({});
  const [inputErrors, setInputErrors] = useState<InputFields>({});
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    setInputValues({
      [inputNames.friend_display_name]: friend_display_name
        ? friend_display_name
        : "",
    });
    setInputErrors({ [inputNames.friend_display_name]: "" });
  }, [friend_display_name]);

  function toggleEditing() {
    setEditing((prev) => !prev);
  }
  function editUsernameHandler() {
    if (friend_display_name === inputValues[inputNames.friend_display_name]) {
      toggleEditing();
      return;
    }

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      setFriendDisplayName({
        friend_id,
        friend_display_name: inputValues[inputNames.friend_display_name],
      })
    );
    toggleEditing();
  }

  return (
    <main className={styles.main}>
      {inputValues[inputNames.friend_display_name] !== undefined && (
        <>
          {editing ? (
            <>
              <InputField
                inputName={inputNames.friend_display_name}
                inputValue={inputValues[inputNames.friend_display_name]}
                inputError={inputErrors[inputNames.friend_display_name]}
                requestError={requestErrors[inputNames.friend_display_name]}
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
                <div className={styles.username}>
                  {inputValues[inputNames.friend_display_name]}
                </div>
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

export default memo(SetFriendDisplayName);
