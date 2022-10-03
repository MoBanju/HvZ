import React from 'react'
import { IGameState } from '../../models/IGameState'

function GameStateIndicator({gamestate}: {gamestate: keyof IGameState}) {
  return (
    <div>{gamestate}</div>
  )
}

export default GameStateIndicator