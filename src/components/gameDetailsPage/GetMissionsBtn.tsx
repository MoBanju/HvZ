
import React from 'react'
import { Spinner } from 'react-bootstrap'
import keycloak from '../../keycloak'
import { IMission } from '../../models/IMission'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RequestsEnum } from '../../store/middleware/requestMiddleware'
import { namedRequestInProgAndError } from '../../store/slices/requestSlice'
import { DeleteMissionByIdAction } from '../api/deleteMissionById'
import { GetMissionsAction } from '../api/getMissions'
import { IPostMissionRequest, PostMissionInGameAction } from '../api/postMission'
import { PutMissionAction } from '../api/putMission'



function GetMissionBtn() {

    const { game, missions } = useAppSelector(state => state.game)
    const dispatch = useAppDispatch()
    const [loading] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGames)
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")


    const GetMission: any = () => {
        if (game) {
            dispatch(GetMissionsAction(game.id))
        }
    }

    const PostMission: any = () => {
        if (game) {
            let mission: IPostMissionRequest = {
                name: "heihei",
                is_human_visible: true,
                description: "mylalamission",
                start_time: "2022-10-19T12:45:59.027Z",
                end_time: "2022-10-19T13:41:59.027Z",
                is_zombie_visible: true,
                latitude: game.sw_lat + 0.0001,
                longitude: game.sw_lng + 0.0001
            }
            dispatch(PostMissionInGameAction(game.id, mission))
        }
    }


    const PutMission: any = () => {
        if (game) {
            let mission: IMission = {
                id: 10,
                name: 'vebjørn',
                is_human_visible: false,
                is_zombie_visible: false,
                description: "jeees",
                start_time: "2022-10-19T13:48:57.376Z",
                end_time: "2022-10-19T13:48:57.376Z",
                latitude: game.sw_lat + 0.0001,
                longitude: game.sw_lng + 0.0001
            }
            dispatch(PutMissionAction(game.id, 10, mission))
        }
    }

    const DeleteMission: any = () => {
        if (game) {
            dispatch(DeleteMissionByIdAction(game.id, 11))
        }
    }

    if (isAdmin) {
        return (<>
            {!loading ? (<button onClick={GetMission} className="btn btn-dark mt-3 mb-3">Get Missions</button>)
                : <Spinner animation="border" size={"sm"} />}
            <button onClick={PostMission} className="btn btn-dark mt-3 mb-3">Post Mission</button>
            <button onClick={PutMission} className="btn btn-dark mt-3 mb-3">Put Mission</button>
            <button onClick={DeleteMission} className="btn btn-dark mt-3 mb-3">Delete Mission</button>

        </>)
    }
    return (<>
        <button onClick={GetMission} className="btn btn-dark mt-3 mb-3">Get Missions</button>
    </>)
}


export default GetMissionBtn