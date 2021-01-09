import client from "./client";

// const get = (authToken) =>
//   client.get("/messages", {}, { headers: { "x-auth-token": authToken } });

// const discard = (id) => client.delete(`/messages/${id}`);

const post = (mail) => client.post("/messages", mail);

export default {
  // get,
  // discard,
  post
};
