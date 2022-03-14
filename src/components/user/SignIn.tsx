import { Button } from "@mui/material";
import { FormEvent, MouseEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/user/asyncThunk/sign-in";
import { selectRequestErrors } from "../../redux/user/userSlice";
import { inputNames } from "../../utils/enums/input-names";
import { initializeValues } from "../../utils/helpers/input-check/initialize-values";
import { onSubmitCheck } from "../../utils/helpers/input-check/on-submit-check";
import InputField, { InputErrors, InputValues } from "../input/InputField";

const inputFields = [inputNames.email, inputNames.password];

function SignIn(): JSX.Element {
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
      signIn({ email: inputValues.email, password: inputValues.password })
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
          Log in
        </Button>
      </form>
    </main>
  );
}

export default memo(SignIn);
