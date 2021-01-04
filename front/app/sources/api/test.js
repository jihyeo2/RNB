import client from "../../api/client";

const register = (testInfo) =>
  client.get("/tests/me", { headers: { "x-auth-token": testInfo } });

export default { register };
