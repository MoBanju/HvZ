
import { AiOutlineEdit } from 'react-icons/ai'
import { Dispatch } from 'react';
import { EditState, Item } from '../../pages/AdminPage';
import { IMission } from '../../models/IMission';

interface IParams {
    mission: IMission,
    setEditItem: Dispatch<React.SetStateAction<{ item: Item; itemType: EditState; }>>
}

function MissionTableItem({ mission, setEditItem }: IParams) {
    const editMission = () => { setEditItem({item: mission, itemType: EditState.UpdateMission})};

    return (
        <tr key={mission.id}>
            <td>{mission.id}</td>
            <td>{mission.name}</td>
            <td>{mission.description ? mission.description : 'No description'}</td>
            <td>{mission.is_human_visible}</td>
            <td>{mission.is_zombie_visible}</td>
            <td> <AiOutlineEdit onClick={editMission}/> </td>
        </tr>
    )
}

export default MissionTableItem