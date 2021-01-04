import client from "./client";

// const get = (authToken) =>
//   client.get("/messages", {}, { headers: { "x-auth-token": authToken } });

// const discard = (id) => client.delete(`/messages/${id}`);

const post = (message) => client.post("/messages", message);

export default {
  // get,
  // discard,
  post
};
