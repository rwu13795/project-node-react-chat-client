import { Dispatch, SetStateAction } from "react";

export function onFocusCheck(
  setTouched: Dispatch<SetStateAction<boolean>>
): void {
  setTouched(true);
}
