import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatResponse } from "../../components/api/getChatByGameId";
import { GameState } from "../../components/api/getGameState";
import { IKillResponse } from "../../components/api/getKillsByGameId";
import keycloak from "../../keycloak";
import { IChat } from "../../models/IChat";
import { ICheckin } from "../../models/ICheckin";
import { IGame } from "../../models/IGame";
import { IKill } from "../../models/IKill";
import { IMission } from "../../models/IMission";
import { IPlayer } from "../../models/IPlayer";
import { ISquad } from "../../models/ISquad";
import { ISquadMember } from "../../models/ISquadMember";

interface initialeState {
    game: IGame | undefined,
    currentPlayer: IPlayer | undefined,
    players: IPlayer[],
    chat: IChat[],
    kills: IKill[],
    missions: IMission[],
    checkins: ICheckin[],
    squads: ISquad[],
    squadMembers: ISquadMember[],
}

const initialState: initialeState = {
    game: undefined,
    currentPlayer: undefined,
    players: [],
    chat: [],
    kills: [],
    missions: [],
    checkins: [],
    squads: [],
    squadMembers: [],
}



const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        setGameState: (state, action: PayloadAction<GameState>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        setChat: (state, action: PayloadAction<IChatResponse[]>) => { //setChat
            
            let chat = action.payload
                .filter(chatResponse => state.players.some(player => player.id === chatResponse.playerId))
                .map<IChat>(chatResponse => {
                    let player = {...state.players.find(player => player.id === chatResponse.playerId), squadId: chatResponse.squadId} as IPlayer;
                    return {
                        id: chatResponse.playerId,
                        message: chatResponse.message,
                        chatTime: chatResponse.chatTime,
                        isHumanGlobal: chatResponse.isHumanGlobal,
                        isZombieGlobal: chatResponse.isZombieGlobal,
                        player: player,
                    };
                });
            return {
                ...state,
                chat,
            }
        },
        addChatMsg: (state, action: PayloadAction<IChat>) => ({ //From postChatMessageAPI
            ...state,
            chat: [...state.chat, action.payload],
        }),
        updatePlayerState: (state, action: PayloadAction<IPlayer>) => {
            let players = state.players.map(player => {
                if (player.id === action.payload.id) {
                    return action.payload
                }
                return player
            })

            return {
                ...state,
                players
            }

        },
        updateKill: (state, action: PayloadAction<IKill>) => {
            let kills = state.kills.map(kill => {
                if (kill.id === action.payload.id)
                    return action.payload;
                return kill;
            })

            return {
                ...state,
                kills,
            }
        },
        addPlayer: (state, action: PayloadAction<IPlayer>) => {
            const currPlayer = action.payload.user.keyCloakId === keycloak.tokenParsed?.sub ? action.payload : undefined;
            return {
                ...state,
                currentPlayer: currPlayer,
                players: [...state.players!, action.payload],
            }
        },
        addKill: (state, action: PayloadAction<IKillResponse>) => {
            if(action.payload.playerKills.length != 2)
                return {
                    ...state
                };
            if(!state.players.some(player => player.id === action.payload.playerKills[0].playerId) || 
                !state.players.some(player => player.id === action.payload.playerKills[1].playerId))
                return {
                    ...state
                };
            const newKill: IKill = {
                id: action.payload.id,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
                description: action.payload.description,
                timeDeath: action.payload.timeDeath,
                killer: state.players.find(player => player.id === action.payload.playerKills[1].playerId)!,
                victim: state.players.find(player => player.id === action.payload.playerKills[0].playerId)!,
            }
            return {
                ...state,
                kills: [... state.kills, newKill],
                // Update local state such that the killed player's isHuman flag is set to false.
                players: state.players.map<IPlayer>(player => {
                    if (player.id === newKill.victim.id)
                        return {
                            ...player,
                            isHuman: false,
                        }
                    return player;
                }),
                // If currentplayer is set, update isHuman flag to false.
                currentPlayer: (state.currentPlayer && state.currentPlayer.id === newKill.victim.id) ? {...state.currentPlayer, isHuman: false} : state.currentPlayer,
            }
        },
        addSquadMember: (state, action: PayloadAction<any>) => {
            let squadMember : ISquadMember = action.payload[0];
            let payloadPlayer : IPlayer | undefined = state.currentPlayer ?  
                {...state.currentPlayer, id: squadMember.playerId, squadId: action.payload.id[1]} : state.currentPlayer

            return {
                ...state,
                currentPlayer: payloadPlayer && state.currentPlayer && 
                    payloadPlayer.id === state.currentPlayer.id ? payloadPlayer : state.currentPlayer,
                squads: state.squads.map<ISquad>(squad => {
                    if (squad.id !== action.payload[1]) {
                        return squad
                    }
                    return {
                        ...squad,
                        squad_Members: [...squad.squad_Members, action.payload[0]], 
                    }
                }
                )
            }

        },
        addCheckin: (state, action: PayloadAction<ICheckin>) => {
            return {
                ...state,
                checkins: [... state.checkins, action.payload],
            };
        },
        addSquad: (state, action: PayloadAction<ISquad>) => {
            if(action.payload.squad_Members.length > 0 && action.payload.squad_Members[0].playerId > 0){
                var payloadPlayer : IPlayer | undefined = state.currentPlayer ?  
                {...state.currentPlayer, id: action.payload.squad_Members[0].playerId, squadId: action.payload.id} : state.currentPlayer
                return {
                    ...state,
                    currentPlayer: payloadPlayer && state.currentPlayer && payloadPlayer.id === state.currentPlayer.id ? payloadPlayer : state.currentPlayer,
                    squads: [...state.squads, action.payload],
                }
            }
                
            return {
                ...state,
                squads: [...state.squads, action.payload],
            }
        },
        deletePlayer: (state, action: PayloadAction<number>) => {
            const currPlayer = state.currentPlayer?.id === action.payload ? undefined : state.currentPlayer;
            return {
                ...state,
                currentPlayer: currPlayer,
                players: state.players.filter(item => item.id !== action.payload),
            }
        },
        deleteKill: (state, action: PayloadAction<number>) => {
            return {
                ...state,
                kills: state.kills.filter(kill => kill.id !== action.payload),
            };
        },
        updateGameState: (state, action: PayloadAction<IGame>) => {

            let game = action.payload
            return {
                ...state,
                game
            }
        },
        setMissions: (state, action: PayloadAction<IMission[]>) => {
            let missions = action.payload
            return {
                ...state,
                missions
            }
        },
        addMission: (state, action: PayloadAction<IMission>) => {
            let mission = action.payload
            return {
                ...state,
                missions: [...state.missions, mission]
            }
        },
        updateMission: (state, action: PayloadAction<IMission>) => {
            let missions = state.missions.map(mission => {
                if (mission.id === action.payload.id) {
                    return action.payload
                }
                return mission
            })
            return {
                ...state,
                missions
            }
        },
        deleteMission: (state, action: PayloadAction<number>) => {

            return {
                ...state,
                missions: state.missions.filter(mission => mission.id !== action.payload)
            }
        },
    },
});


export const {
    setGameState,
    setChat,
    addChatMsg,
    updatePlayerState,
    addPlayer,
    deletePlayer,
    updateGameState,
    setMissions,
    addMission,
    updateMission,
    deleteMission,
    addKill,
    updateKill,
    deleteKill,
    addSquad,
    addSquadMember,
    addCheckin,
} = gameSlice.actions;

export default gameSlice.reducer;