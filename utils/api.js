import axios from "axios";

export const createUserAPI = async (data) => {
  return await axios
    .post(`http://localhost:3000/api/users`, data)
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};

export const getUsersAPI = async (params) => {
  return await axios
    .get(`http://localhost:3000/api/users`, { params })
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};
