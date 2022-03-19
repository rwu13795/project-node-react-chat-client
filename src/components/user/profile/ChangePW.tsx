import { memo, useEffect, useState, MouseEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCurrentUser,
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../../redux/user/userSlice";
import {
  initializeValues,
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
} from "../../../utils";
import InputField, {
  customStyleOptions,
  InputErrors,
  InputValues,
} from "../../input-field/InputField";

// UI //
import styles from "./ChangePW.module.css";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
import { changePassword } from "../../../redux/user/asyncThunk";

const inputFields = [
  inputNames.old_password,
  inputNames.new_password,
  inputNames.confirm_new_password,
];

function ChangePW(): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [inputValues, setInputValues] = useState<InputValues>(
    initializeValues<InputValues>(inputFields)
  );
  const [inputErrors, setInputErrors] = useState<InputErrors>(
    initializeValues<InputErrors>(inputFields)
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    if (loading === loadingStatusEnum.resetPW_succeeded) {
      setIsChanged(true);
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [loading, dispatch]);

  function changePasswordHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      changePassword({
        old_password: inputValues[inputNames.old_password],
        new_password: inputValues[inputNames.new_password],
        confirm_new_password: inputValues[inputNames.confirm_new_password],
      })
    );
  }

  return (
    <form className={styles.main} onSubmit={changePasswordHandler}>
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
            isDisabled={isChanged}
          />
        );
      })}

      <div className={styles.button_wrapper}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isChanged}
          loading={loading === loadingStatusEnum.resetPW_loading}
          onClick={changePasswordHandler}
          className={styles.button}
        >
          <EditIcon fontSize="small" />
          Change Password
        </LoadingButton>
      </div>

      {isChanged && (
        <div className={styles.succeeded_text}>
          The password has been changed successfully!
        </div>
      )}
    </form>
  );
}

export default memo(ChangePW);
