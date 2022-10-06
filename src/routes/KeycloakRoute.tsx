import { Navigate } from "react-router-dom";
import keycloak from "../keycloak";

interface IProps {
    children: JSX.Element,
    role: string,
    redirectTo?: string,
}

function KeycloakRoute({children, role, redirectTo = "/"}: IProps) {
    if(!keycloak.authenticated) {
        return <Navigate replace to={redirectTo}/>
    }

    if(keycloak.hasRealmRole(role)) {
        return <>{children}</>
    }

    return <Navigate replace to={redirectTo}/>
}

export default KeycloakRoute;