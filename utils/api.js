import axios from "axios";

// USERS

// Post operation will create an entry in Mongo that has createdAt, updatedAt, _id, and firebaseId
export const createUserAPI = async (data) => {
  return await axios
    .post(`http://localhost:3000/api/users`, data)
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};

// Can query by the firebase id (uid)
export const getUsersAPI = async (params) => {
  return await axios
    .get(`http://localhost:3000/api/users`, { params })
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};

// JOURNAL ENTRIES

// Post operation will create an entry in Mongo that has createdAt, updatedAt, _id, and userId
export const createEntryAPI = async (data) => {
  return await axios
    .post(`http://localhost:3000/api/entries`, data)
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};

// Can query by the user's id that is on the entry object to match journal entries to a user
export const getEntriesAPI = async (params) => {
  return await axios
    .get(`http://localhost:3000/api/entries`, { params })
    .then((response) => response)
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};
