import client from "../../api/client";

const getStoresInNeed = () => client.get("/storesInNeed");
const signUp = (authToken, signing, id) =>
  client.put(`/storesInNeed/${id}`, signing, {
    headers: { "x-auth-token": authToken },
  });

export default {
  getStoresInNeed,
  signUp,
};
