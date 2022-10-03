import React from 'react'
import { IGameState } from '../../models/IGameState'

function JoinGameBtn({gamestate}: {gamestate: keyof IGameState}) {
    if(gamestate !== 'register')
        return (<></>);
  return (
    <div>JoinGameBtn</div>
  )
}

export default JoinGameBtn