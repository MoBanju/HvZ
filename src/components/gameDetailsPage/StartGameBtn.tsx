import React from 'react'
import { Spinner } from 'react-bootstrap';
import keycloak from '../../keycloak';
import { IGame } from '../../models/IGame';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RequestsEnum } from '../../store/middleware/requestMiddleware';
import { namedRequestInProgAndError } from '../../store/slices/requestSlice';
import { PutGameByIdAction } from '../api/putGameById';


function StartGameBtn() {

  const { game } = useAppSelector(state => state.game)
  const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutGameById)
  const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
  const dispatch = useAppDispatch();
  
  const startGame: any = () => {
    if (game) {
      dispatch(PutGameByIdAction(game, "Progress", undefined))
    }
  }


  if (game?.state === "Registration" && isAdmin) {
    return (
      <>
        {!loading ? (<button className="btn btn-danger mt-3 mb-3 me-2" onClick={startGame}>Start Game</button>)
          : <Spinner animation="border" size={"sm"} />}
      </>)
  }

  else {
    return (
      <><div></div></>
    )
  }
}

export default StartGameBtn