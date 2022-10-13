import React from 'react'
import { IGameState } from '../../models/IGameState'

function JoinGameBtn({gamestate}: {gamestate: keyof IGameState}) {
  if(gamestate !== 'Registration')
    return (null);
  return (
    <button className='btn btn-dark btn-lg rounded-3'>Join</button>
  )
}

export default JoinGameBtn