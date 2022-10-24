import keycloak from "../../keycloak";
import "../../pages/LandingPage.css";


function LoginForm() {


    if (keycloak.authenticated) {
        return (<><div className="table-resp">
            <button onClick={() => keycloak.logout()} className="btn btn-dark btn-lg login-btn ">Logout</button>
        </div></>)
    }
    else {
        return (
            <div>
                <div>
                    <button onClick={() => keycloak.login()} className="btn btn-dark btn-lg login-btn ">Login</button>
                </div>
                <div>
                    <button onClick={() => keycloak.register()} className="btn btn-dark btn-lg login-btn">Register</button>
                </div>
            </div>
        );
    }
}

export default LoginForm;