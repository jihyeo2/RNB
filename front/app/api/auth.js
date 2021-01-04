import client from "./client";

const login = (phone, password) => client.post("/auth", { phone, password });

export default {
  login,
};
