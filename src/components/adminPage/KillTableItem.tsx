import { IKill } from '../../models/IKill'
import { AiOutlineEdit } from 'react-icons/ai'
import { Dispatch } from 'react';
import { EditState, Item } from '../../pages/AdminPage';

interface IParams {
    kill: IKill,
    setEditItem: Dispatch<React.SetStateAction<{ item: Item; itemType: EditState; }>>
}

function KillTableItem({ kill, setEditItem }: IParams) {
    const hasLocation = (kill: IKill) => kill.latitude && kill.longitude ? "Yes" : "No";
    const editKill = () => { setEditItem({item: kill, itemType: EditState.UpdateKill});};

    return (
        <tr key={kill.id}>
            <td>{kill.id}</td>
            <td>{kill.killer.user.firstName}</td>
            <td>{kill.victim.user.firstName}</td>
            <td>{hasLocation(kill)}</td>
            <td>{kill.description ? kill.description : 'No description'}</td>
            <td> <AiOutlineEdit onClick={editKill}/> </td>
        </tr>
    )
}

export default KillTableItem