import { Button } from "@mui/material";
import { FormEvent, MouseEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../redux/user/asyncThunk/sign-up";
import { selectRequestErrors } from "../../redux/user/userSlice";
import { inputNames } from "../../utils/enums/input-names";
import { onSubmitCheck } from "../../utils/helpers/input-check/on-submit-check";
import { initializeValues } from "../../utils/helpers/input-check/__index";
import InputField, { InputErrors, InputValues } from "../input/InputField";

const inputFields = [
  inputNames.email,
  inputNames.username,
  inputNames.password,
  inputNames.confirm_password,
];

function SignUp(): JSX.Element {
  const dispatch = useDispatch();
  const requestErrors = useSelector(selectRequestErrors);

  const [inputValues, setInputValues] = useState<InputValues>(
    initializeValues<InputValues>(inputFields)
  );
  const [inputErrors, setInputErrors] = useState<InputErrors>(
    initializeValues<InputErrors>(inputFields)
  );

  function onSubmitHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      signUp({
        email: inputValues[inputNames.email],
        username: inputValues[inputNames.username],
        password: inputValues[inputNames.password],
        confirm_password: inputValues[inputNames.confirm_password],
      })
    );
  }

  return (
    <main>
      <form onSubmit={onSubmitHandler}>
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
            />
          );
        })}
        <Button type="submit" onClick={onSubmitHandler}>
          Sign Up
        </Button>
      </form>
    </main>
  );
}

export default memo(SignUp);
