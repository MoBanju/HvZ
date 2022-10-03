import { GAMES } from "../../constants/GAMES";
import GamesTableItem from "./GamesTableItem";

function GamesTable() {
    return (<>
    <div>GAMES TABEL</div>
    {GAMES.map(game => <GamesTableItem game={game} />)}
    </>)
}

export default GamesTable;