import { Container, Row, Col } from "react-bootstrap";
import GamesTable from "../components/landingPage/GamesTable";
import LoginForm from "../components/landingPage/LoginForm";
import keycloak from "../keycloak";
import "./LandingPage.css";

function LandingPage() {
    console.log(keycloak.tokenParsed)
    return (
        <>
    <Container className="justify-content-center align-items-center background d-flex" fluid>
        <Row> 
        {keycloak.authenticated && <span>Logged in as: {keycloak.tokenParsed?.preferred_username} </span>}
            <Col className="m-auto"> 
                <div className="card m-5 mx-auto">
                    <div className="card-text">
                        <LoginForm/>
                    </div>
                </div>
            </Col>
            <Col>
            <div className="card m-5 mx-auto">
                    <div className="card-text">
                        <GamesTable/>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
    </>)
}


export default LandingPage;