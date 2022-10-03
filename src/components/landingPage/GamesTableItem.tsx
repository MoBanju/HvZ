import { IGame } from "../../models/IGame";

function GamesTableItem({game}: {game: IGame}) {
    return (<>
    <div>{game.title}</div> 
    </>)
    
}

export default GamesTableItem;