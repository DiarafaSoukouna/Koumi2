import { useContext } from "react";
import { AuthContext } from "./authContext";

export default () => {
  const contextInstance = useContext(AuthContext);
  if (contextInstance === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return contextInstance;
};
