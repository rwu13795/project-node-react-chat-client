import {
  InputErrors,
  InputValues,
} from "../../../components/input-field/InputField";

export function initializeValues<T extends InputValues | InputErrors>(
  inputFields: string[]
): T {
  const object = {} as T;
  for (let field of inputFields) {
    object[field] = "";
  }
  return object;
}
