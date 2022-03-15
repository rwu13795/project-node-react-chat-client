import { memo, useState } from "react";
import { useSelector } from "react-redux";

import {
  selectCurrentUser,
  selectRequestErrors,
} from "../../../redux/user/userSlice";
import { inputNames } from "../../../utils";
import InputField, { InputErrors, InputValues } from "../../input/InputField";

interface Props {
  username: string;
}

function ChangeUsername({ username }: Props): JSX.Element {
  const currentUser = useSelector(selectCurrentUser);
  const requestErrors = useSelector(selectRequestErrors);
  //   const loading = useSelector(selectLoadingStatus_user);

  console.log("username", username);

  const [inputValues, setInputValues] = useState<InputValues>({
    [inputNames.username]: username,
  });
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    [inputNames.username]: "",
  });

  return (
    <main>
      Username:{" "}
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
    </main>
  );
}

export default memo(ChangeUsername);
