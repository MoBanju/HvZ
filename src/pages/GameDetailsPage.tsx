import BiteCode from "../components/gameDetailsPage/BiteCode";
import Chat from "../components/gameDetailsPage/Chat";
import GameDescription from "../components/gameDetailsPage/GameDescription";
import GameStateIndicator from "../components/gameDetailsPage/GameStateIndicator";
import JoinGameBtn from "../components/gameDetailsPage/JoinGameBtn";
import { GAMES } from "../constants/GAMES";

function GameDetailsPage() {
    const game = GAMES[0];
    return (<>
    <div>GAMES DETAILS PAGE</div> 
    <GameStateIndicator gamestate={game.state} />
    <GameDescription title={game.title} description={game.description} />
    <JoinGameBtn gamestate={game.state}/>
    <BiteCode />
    <Chat chatmessages={game.chat}/>
    </>)
}

export default GameDetailsPage;