import client from "../../api/client";

const getCategories = () => client.get("/categories");

export default {
  getCategories,
};
