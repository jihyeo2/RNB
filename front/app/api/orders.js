import client from "./client";

const getOrders = (authToken) => 
  client.get(`/orders`, {} , { headers: { "x-auth-token": authToken }});

const getByCustomer = (authToken) => client.get(`/orders/customer`, {}, { headers: { "x-auth-token": authToken }});
const add = (authToken, order) => {
  return client.post(`/orders`, order, { headers: { "x-auth-token": authToken }
  });
};

const search = (authToken, filter) => 
  client.post(`/orders/search`, filter, { headers: { "x-auth-token": authToken }});

const edit = (authToken, order) => {
  return client.put(`/orders`, order, {
    headers: { "x-auth-token": authToken }
  });
};
// const edit = (authToken, order , onUploadProgress) => {
//   return client.put(`/orders`, order, {
//     headers: { "x-auth-token": authToken },
//     onUploadProgress: (progress) =>
//       onUploadProgress(progress.loaded / progress.total),
//   });
// };

const remove = (authToken, id) =>
  client.delete(
    `/orders/${id}`,
    {},
    { headers: { "x-auth-token": authToken } }
  );


export default {
  getOrders,
  getByCustomer, 
  add,
  search,
  edit,
  remove,
};
