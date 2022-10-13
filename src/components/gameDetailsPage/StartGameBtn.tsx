import React from 'react'
import keycloak from '../../keycloak';
import { useAppDispatch, useAppSelector } from '../../store/hooks';


function StartGameBtn() {

  //Endre game-state fra register til in-progress

  //PUT Games with game-id
  const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
  const { game, currentPlayer, players } = useAppSelector(state => state.game)
  const dispatch = useAppDispatch();

  if (game?.state === "Registration" && isAdmin) {

    return (
      <>
        <button className="btn btn-dark mt-3 mb-3">Start Game</button>
      </>)
  }
  else{
    return (
      <><div>startgameBtn var her</div></>
    )
  }
}

export default StartGameBtn