import {createContext} from "react";
import { User } from "../types";

interface appContext {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<appContext | null>(null);