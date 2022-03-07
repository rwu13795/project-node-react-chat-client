import axios from "axios";

const axios_client = () => {
  return axios.create({
    withCredentials: true,
  });
};

export default axios_client;
