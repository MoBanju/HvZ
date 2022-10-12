import keycloak from "../../keycloak"

async function getAuthHeaders(): Promise<HeadersInit> {

    // Not logged in, do not include auth
    if(!keycloak.token)
        return {
            "Content-Type": "application/json",
        }
    const token = keycloak.token;

    // Is logged in and has a valid token
    if(!keycloak.isTokenExpired())
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    

    // Is logged in, but token has expired
    // Attempt to refresh token
    const HOUR_IN_SECONDS = 3600;
    try {
        await keycloak.updateToken(HOUR_IN_SECONDS);
    }
    catch(e){
        console.log(e)
    }
    
    return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
    }
}

export default getAuthHeaders;