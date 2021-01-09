import client from "./client";

const show = (authToken) =>
  client.get("/users/me", {}, { headers: { "x-auth-token": authToken } });
  
const register = (userInfo) => 
  client.post("/users", userInfo);

const edit = (authToken, userInfo) =>
  client.put("/users/me", userInfo, {
    headers: { "x-auth-token": authToken }
  });

const editNotification = (authToken, userInfo) =>
client.put("/users/notification", userInfo, {
  headers: { "x-auth-token": authToken }
});

const remove = (authToken) =>
  client.delete("/users/me", {}, { headers: { "x-auth-token": authToken } });


export default { register, show, edit, editNotification, remove };
