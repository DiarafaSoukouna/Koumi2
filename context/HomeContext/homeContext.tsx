import { homeContextType } from "@/Types/homeType";
import { createContext } from "react";

export const HomeContext = createContext<homeContextType>(undefined!);
