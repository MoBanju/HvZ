import { Dispatch, useMemo, useState } from "react";
import { IGame } from "../../models/IGame";
import { IKill } from "../../models/IKill";
import { IMission } from "../../models/IMission";
import { IPlayer } from "../../models/IPlayer";
import { EditState, Item } from "../../pages/AdminPage"
import AddKill from "./AddKill";
import AddMission from "./AddMission";
import EditGame from "./EditGame";
import EditKill from "./EditKill";
import EditMission from "./EditMission";
import EditPlayer from "./EditPlayer";

interface IParams {
    game: IGame
    item: Item,
    itemType: EditState,
    setItem: Dispatch<React.SetStateAction<{ item: Item; itemType: EditState; }>>
}

export type HideEditFormFnc = (successMessage: string | undefined) => void;

function EditItem({ game, item, itemType, setItem }: IParams) {

    const hideEditForm: HideEditFormFnc = (successMessage: string | undefined) => { 
        if(successMessage) {
            setSuccessMessage(successMessage);
        }
        setItem({ item: undefined, itemType: EditState.None });
    }

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    const itemComponent = useMemo(() => {
        if(itemType !== EditState.None)
            setSuccessMessage(undefined);
        switch (itemType) {
            case EditState.UpdateGame:
                return <EditGame
                    game={item as IGame}
                    closeForm={hideEditForm}
                />
            case EditState.UpdatePlayer:
                return <EditPlayer
                    game={game}
                    player={item as IPlayer}
                    closeForm={hideEditForm}
                />
            case EditState.UpdateKill:
                return <EditKill
                    game={game}
                    kill={item as IKill}
                    closeForm={hideEditForm}
                />
            case EditState.UpdateMission:
                return <EditMission
                    game={game}
                    mission={item as IMission}
                    closeForm={hideEditForm}
                />
            case EditState.CreateKill:
                return <AddKill
                    game={game} 
                    closeForm={hideEditForm}
                />
            case EditState.CreateMission:
                return <AddMission
                    game={game}
                    closeFrom={hideEditForm}
                />
            default:
                return <p>Select an item in one of the tables to edit</p>;
        }
    }, [itemType, item])


    return (<>
        {successMessage && <p>{successMessage}</p>}
        {itemComponent}
    </>)
}

export default EditItem