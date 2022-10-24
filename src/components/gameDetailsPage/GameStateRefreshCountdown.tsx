import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { getGameStateAction } from "../api/getGameState";

const FETCH_GAME_STATE_INTERVAL = 30;

var TIMER: NodeJS.Timer | undefined;

function GameStateRefreshCountdown({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const [countdownValue, setCountdownValue] = useState<number>(FETCH_GAME_STATE_INTERVAL);
  const [active, setActive] = useState(false);
  const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGameStatePeriodicaly);

  useEffect(() => {
    if (active && !TIMER) {
      TIMER = setInterval(() => {
        
        if (countdownValue < 1) {
          getGameState();
          clearInterval(TIMER);
          TIMER = undefined;
        }
        else {
          setCountdownValue(prev => prev - 1);
        }
      }, 1000);
    }
    else if(!active) {
      clearInterval(TIMER);
      TIMER = undefined;
    }
    
    return () => {
      clearInterval(TIMER);
      TIMER = undefined;
    }
  }, [active, countdownValue]);


  const resetCounter = () => {
    if (active) {
      setCountdownValue(FETCH_GAME_STATE_INTERVAL);
    }
  }

  const getGameState = () => {
    const action = getGameStateAction(id, false, resetCounter)
    dispatch(action);
  }

  const handleRefreshBtnClicked = () => {
    getGameState();
    if(active) {
      setCountdownValue(FETCH_GAME_STATE_INTERVAL);
    }
  }

  return (
    <Container className="d-flex">
      {loading && <Spinner animation="border" size="sm" style={{position: 'absolute'}} />}
      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <span>{countdownValue}</span>
        <Form.Check
          type="switch"
          id="active"
          label="Active"
          onChange={() => { setActive(prev => !prev) }}
          defaultChecked={active}
        />
      </Container>
      <Button className="mt-2 h-25" onClick={handleRefreshBtnClicked} variant="secondary">Refresh</Button>
    </Container>
  )
}

export default GameStateRefreshCountdown