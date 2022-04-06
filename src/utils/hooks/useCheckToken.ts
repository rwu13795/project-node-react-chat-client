import { useCallback, useEffect, useState } from "react";
import { axios_client } from "..";
import { serverUrl } from "../../redux/utils";

interface Res_props {
  isValid: boolean;
  expirationInMS: number;
}

export function useCheckToken(token: string | null, user_id: string | null) {
  const client = axios_client();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [expirationInMS, setExpirationInMS] = useState<number>(0);

  const checkToken = useCallback(async () => {
    try {
      const { data } = await client.post<Res_props>(
        serverUrl + `/auth/check-token`,
        { token, user_id }
      );

      setIsValid(data.isValid);
      setExpirationInMS(data.expirationInMS);
    } catch (err) {
      setIsValid(false);
    }
  }, [token, user_id]);

  useEffect(() => {
    if (token && user_id) {
      setIsLoading(true);
      checkToken();
      setIsLoading(false);
    }
  }, [checkToken, token, user_id]);

  return { isValid, isLoading, expirationInMS };
}
