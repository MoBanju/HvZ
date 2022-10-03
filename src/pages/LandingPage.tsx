import { Container, Row, Col } from "react-bootstrap";
import GamesTable from "../components/landingPage/GamesTable";
import LoginForm from "../components/landingPage/LoginForm";
import "./LandingPage.css";

function LandingPage() {
    return (
    <Container className="justify-content-center align-items-center test" fluid>
        <Row> 
            <Col> Hie </Col>
            <Col> Hade</Col>
        </Row>
        <LoginForm />
        <GamesTable />
    </Container>)
}


export default LandingPage;