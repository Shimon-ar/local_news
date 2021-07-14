import { useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { User } from "../types";

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({name:'', id:-1, is_manager:false});
  const provideUser = useMemo(()=>({user, setUser}), [user, setUser])


  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};