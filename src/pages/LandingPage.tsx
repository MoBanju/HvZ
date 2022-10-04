import { Container, Row, Col } from "react-bootstrap";
import GamesTable from "../components/landingPage/GamesTable";
import LoginForm from "../components/landingPage/LoginForm";
import "./LandingPage.css";

function LandingPage() {
    return (
    <Container className="justify-content-center align-items-center background d-flex" fluid>
        <Row> 
            <Col className="m-auto"> 
                <div className="card m-5 mx-auto">
                    <p className="card-text">
                        <LoginForm/>
                    </p>
                </div>
            </Col>
            <Col>
            <div className="card m-5 mx-auto">
                    <p className="card-text">
                        <GamesTable/>
                    </p>
                </div>
            </Col>
        </Row>
    </Container>)
}


export default LandingPage;