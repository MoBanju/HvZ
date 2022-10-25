import { Container, Row, Col } from "react-bootstrap";
import { MdAdminPanelSettings } from "react-icons/md";
import GamesTable from "../components/landingPage/GamesTable";
import LoginForm from "../components/landingPage/LoginForm";
import keycloak from "../keycloak";
import "./LandingPage.css";

function LandingPage() {
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")

    return (
        <>
    <Container className="justify-content-center align-items-center background d-flex" fluid>
        <div className=" position-fixed top-0 end-0 m-3 logged-in">
                {keycloak.authenticated && <span>Logged in as: {keycloak.tokenParsed?.name} </span>}
                {isAdmin && <span> <MdAdminPanelSettings size={30} /> Admin</span>}
        </div>
        <Row> 
            <Col className="m-auto"> 
                <div className="card m-5 mx-auto card-detail">
                    <div className="card-text">
                        <LoginForm/>
                    </div>
                </div>
            </Col>
            <Col>
            <div className="card m-5 mx-auto card-detail">
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