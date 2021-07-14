import { useContext } from "react";
import { Redirect, Route} from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Routes } from "../types";


const PrivateRoute = ({ RouteComponent, ...rest }: any) => {
    const userContext = useContext(UserContext);
   
    return (
        <Route {...rest}
            render={(props) =>
                (userContext && userContext.user.id > -1) 
                    ?(<RouteComponent {...props} />)
                    : <Redirect to={Routes.login} />
            } />);
};

export default PrivateRoute;