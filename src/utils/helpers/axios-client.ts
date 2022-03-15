import axios from "axios";

export const axios_client = () => {
  return axios.create({
    withCredentials: true,
  });
};
