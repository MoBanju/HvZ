import { Dispatch } from "react";
import { AiOutlineEdit } from "react-icons/ai"
import { IPlayer } from "../../models/IPlayer"
import { EditState, Item } from "../../pages/AdminPage";

interface IParams {
    player: IPlayer,
    setEditItem: Dispatch<React.SetStateAction<{ item: Item; itemType: EditState; }>>
}

function PlayerTableItem({ player, setEditItem }: IParams) {
    const editPlayer = () => {setEditItem({item: player, itemType: EditState.UpdatePlayer})}
    return (
        <tr key={player.id}>
            <td>{player.id}</td>
            <td>{player.user.firstName}</td>
            <td>{player.user.lastName}</td>
            <td>{player.isHuman ? "Yes" : "No"}</td>
            <td> <AiOutlineEdit onClick={editPlayer}/> </td>
        </tr>
    )
}

export default PlayerTableItem