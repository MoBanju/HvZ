import { IGameState } from "../../models/IGameState"

function ProgressBar({gamestate}: {gamestate: keyof IGameState}) {
  let width = 0
  if(gamestate === "Registration") width = 33
  else if(gamestate === "Progress") width = 66
  else if(gamestate === "Complete") width = 100

  return (
    <div className="progress">
        <div className="progress-bar bg-success progress-bar-stripped" role="progressbar" aria-valuenow={25} aria-valuemin = {0} aria-valuemax={100} style={{"width": width + "%"}}></div>
    </div>
  )
}

export default ProgressBar




