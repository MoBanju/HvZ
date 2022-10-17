
import React from 'react'
import { Spinner } from 'react-bootstrap'
import keycloak from '../../keycloak'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RequestsEnum } from '../../store/middleware/requestMiddleware'
import { namedRequestInProgAndError } from '../../store/slices/requestSlice'
import { PutGameByIdAction } from '../api/putGameById'


function EndGameBtn() {

    const { game } = useAppSelector(state => state.game)
    const dispatch = useAppDispatch()
    const [loading] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutGameById)
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")


    const EndGame: any = () => {
        if (game) {
            dispatch(PutGameByIdAction(game, game.state))
        }
    }

    if (game?.state === "Progress" && isAdmin) {
        return (<>
            {!loading ? (<button onClick={EndGame} className="btn btn-dark mt-3 mb-3">End Game</button>)
                : <Spinner animation="border" size={"sm"} />}
        </>)
    }
    return (
        <div></div>
    )
}


export default EndGameBtn