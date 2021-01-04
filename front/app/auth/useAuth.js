import { useContext } from "react";
import AuthContext from "./context";
import authStorage from "./storage";
import userApi from "../api/users";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = async (authToken) => {
    const result = await userApi.show(authToken);
    setUser(result.data);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, logIn, logOut };
};
