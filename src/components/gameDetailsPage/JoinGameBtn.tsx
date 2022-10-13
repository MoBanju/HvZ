import React, { Dispatch, useState } from "react";
import keycloak from "../../keycloak";
import { IGameState } from '../../models/IGameState'
import { IPlayer } from '../../models/IPlayer'
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PostPlayerInGameAction } from '../api/postPlayerInGame';


function JoinGameBtn({ gameId }: { gameId: number }) {
  const { game, currentPlayer, players } = useAppSelector(state => state.game)
  const dispatch = useAppDispatch();

  

  const joinGame = () => {
    if (keycloak.tokenParsed?.given_name && keycloak.tokenParsed?.family_name && keycloak.tokenParsed?.sub) {
      const player: IPlayer = {
        id: 0,
        isHuman: true,
        isPatientZero: false,
        biteCode: Math.random().toString(36).substring(2, 15),
        user: {
          keyCloakId: keycloak.tokenParsed.sub,
          firstName: keycloak.tokenParsed.given_name,
          lastName: keycloak.tokenParsed.family_name,
        }
      }

      const postPlayerAction = PostPlayerInGameAction(gameId, player)
      dispatch(postPlayerAction);
    }
  }
  if (currentPlayer || game?.state !== "Registration") {
    return (
      null
    )
  }
  
  return (
    <button className='btn btn-dark btn-lg rounded-3' onClick={joinGame}>Join</button>
  )
}
export default JoinGameBtn

