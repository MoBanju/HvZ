import keycloak from "../../keycloak";
import "../../pages/LandingPage.css";


function LoginForm() {


    if (keycloak.authenticated) {
        return (<><div>
            <button onClick={() => keycloak.logout()} className="btn btn-dark btn-lg login-btn m-5">Logout</button>
        </div>
            {console.log(keycloak.tokenParsed)}</>)
    }
    else {
        return (
            <>
                <div>
                    <button onClick={() => keycloak.login()} className="btn btn-dark btn-lg login-btn m-5">Login</button>
                </div>
                <div>
                    <button onClick={() => keycloak.register()} className="btn btn-dark btn-lg login-btn m-5">Register</button>
                </div>
                {console.log(keycloak.tokenParsed)}

            </>
        );
    }
}

export default LoginForm;