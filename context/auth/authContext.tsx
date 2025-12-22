import { AuthContextType } from "@/Types/authtype";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>(undefined!);
