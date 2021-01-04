import client from "../../api/client";

const getStores = (categoryId) => client.get(`/categories/${categoryId}`);

export default {
  getStores,
};
