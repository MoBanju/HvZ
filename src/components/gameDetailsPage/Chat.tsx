import { IChat } from "../../models/IChat";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, Collapse, Container, FormControl, InputGroup, Placeholder, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IPlayer } from '../../models/IPlayer';
import { PostChatMessageAction } from "../api/postChatMessage";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import GetChatByGameIdAction from "../api/getChatByGameId";
import React, { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {TbArrowsVertical} from "react-icons/tb"

enum ChatState {
  GLOBAL,
  HUMAN,
  ZOMBIE,
  SQUAD
}

const FETCH_CHAT_INTERVAL = 5000;

const CHAT_STATE_TO_BG_COLOR = ["bg-primary", "bg-success", "bg-danger", "bg-warning bg-opacity-75"];

var TIMER: NodeJS.Timer;

export interface ISquad{
  id: number,
  name: string,
  is_human: boolean,
  squadMember: ISquadMember,
}

export interface ISquadMember{
  playerId: number,
  rank: string
}


function Chat({gameId, currentPlayer}: { gameId: number, currentPlayer: IPlayer | undefined}) {
  const [chatState, setChatState] = useState<ChatState>(ChatState.GLOBAL);
  const [chatMessage, setChatMessage] = useState("");
  const dispatch = useAppDispatch();
  const { chat: chatmessages, squads } = useAppSelector(state => state.game);
  const [isLoadingPost, errorPost] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostChatMessage);
  const [isCollapseOpen, setCollapse] = React.useState(false)

  const chatMsgContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    return () => {clearInterval(TIMER);};
  }, [])

  
  const fetchChat = () => {
    dispatch(GetChatByGameIdAction(gameId));
  }
  
  const [isHuman, isZombie] = useMemo(() => {
    if(!currentPlayer)
      return [false, false];
    // Current player is human
    if(currentPlayer.isHuman)
      return [true, false]
    // Current player is a zombie or patient zero
    return [false, true]
  }, [currentPlayer])
  
  if(!currentPlayer)
  return null;
  
  
  const initCollapse = () => {
    if(!TIMER)
      fetchChat();

    if(!isCollapseOpen) {
      TIMER = setInterval(fetchChat, FETCH_CHAT_INTERVAL);
      scrollToBottomOfChat();
    }
    else
      clearInterval(TIMER);

    setCollapse(!isCollapseOpen)
  }


  const filterChat = (chatMessage: IChat) => {
    switch (chatState) {
      case ChatState.SQUAD:
        return (chatMessage.player.squadId === currentPlayer.squadId)
      case ChatState.HUMAN:
        return chatMessage.isHumanGlobal && isHuman;
      case ChatState.ZOMBIE:
        return chatMessage.isZombieGlobal && isZombie;
      case ChatState.GLOBAL:
        return !chatMessage.isHumanGlobal && !chatMessage.isZombieGlobal &&
          !chatMessage.player.squadId;
      default:
        return false;
    }
  };

  const scrollToBottomOfChat = () => {
    chatMsgContainerRef.current?.scrollIntoView({behavior: "smooth"});
  }

  const sendMessage = () => {
    let isHumanGlobal: boolean = false, isZombieGlobal: boolean = false;
    //Used to identify squad chat messages
    let isSquadChat = false;
    let nonSquadCurrentPlayer : IPlayer = {...currentPlayer, squadId: undefined};

    switch (chatState) {
      case ChatState.HUMAN:
        isHumanGlobal = true;
        isZombieGlobal = false;
        break;
      case ChatState.ZOMBIE:
        isHumanGlobal = false;
        isZombieGlobal = true;
        break;
      case ChatState.SQUAD:
        isSquadChat = true;
        break;
      case ChatState.GLOBAL:
      default:
        isHumanGlobal = false;
        isZombieGlobal = false;
    }

    const msg: IChat = {
      id: 0,
      message: chatMessage,
      chatTime: new Date().toJSON(),
      isHumanGlobal,
      isZombieGlobal,
      player: isSquadChat ? currentPlayer : nonSquadCurrentPlayer,
    };

    if(msg.message.trim().length !== 0){
      const postMessageAction = PostChatMessageAction(gameId, msg, scrollToBottomOfChat);
      dispatch(postMessageAction)
      setChatMessage("");
    }
  };


  return (
    <div className="chat-z">
    <Container className="bg-dark position-absolute bottom-0 end-0 w-25 p-0 rounded mw-2 resp-chat"style={{marginRight: "15px"}}>
        <div id="collapsePanel col-md-auto">
      <ul className="nav nav-tabs rounded-1" role="tablist">
        <Button onClick={initCollapse} className="p-2 text-primary btn-delete" style={{width: "10%"}}>
        <TbArrowsVertical/>
      </Button>
        <Button
          onClick={() => { setChatState(ChatState.GLOBAL) }}
          className={`nav-link p-2 text-primary ${chatState === ChatState.GLOBAL ? "active" : ""}`}
          style={{width:"30%"}}
        >
          Global
        </Button>
        {(isHuman && !isZombie) && <Button
          onClick={() => { setChatState(ChatState.HUMAN) }}
          className={`nav-link p-2 text-success ${chatState === ChatState.HUMAN ? "active" : ""}`}
          style={{width:"30%"}}
        >
          Human
        </Button>}
        {(isZombie && !isHuman) && <Button
          onClick={() => { setChatState(ChatState.ZOMBIE) }}
          className={`nav-link p-2 text-danger ${chatState === ChatState.ZOMBIE ? "active" : ""}`}
          style={{width:"30%"}}
        >
          Zombie
        </Button>}
        {currentPlayer.squadId && <Button
          onClick={() => { setChatState(ChatState.SQUAD) }}
          className={`nav-link p-2 text-warning ${chatState === ChatState.SQUAD ? "active" : ""}`}
          style={{width:"30%"}}
        >
          Squad
        </Button>}
      </ul>
      <Collapse in={isCollapseOpen}>
        <div className="chat-min">

        <Container className="scroll m-1 d-flex flex-column">
          {chatmessages
            .filter(filterChat)
            .map((chat, i) =>
              <p
                key={i}
                className={`mb-1 ${CHAT_STATE_TO_BG_COLOR[chatState]} rounded p-3 m-2 ${currentPlayer.id === chat.player.id ? "align-self-end" : "align-self-start"} mw-50 text-break`}
                style={{maxWidth: "55%"}}
                >
                  ({chat.player.user.firstName}){squads.some(sq => sq.id === chat.player.squadId) && `[${squads.find(sq => sq.id === chat.player.squadId)?.name}]`} {chat.message}
                </p>
              )}
              <div ref={chatMsgContainerRef} />
              <p>!</p>
              <p>!</p>
              <div />
        </Container>
        <Container className="bottom-0 mb-2 mw">
          <InputGroup>
            <InputGroup.Text id="message"
             className={`text-dark ${CHAT_STATE_TO_BG_COLOR[chatState]}`}
              >
                Message
              </InputGroup.Text>
            <FormControl
              name="message"
              className={`${CHAT_STATE_TO_BG_COLOR[chatState]}`}
              style = {{filter: 'brightness(1.6)'}}
              //placeholder="glhf evry1"
              aria-label="Message"
              aria-describedby="message"
              value={chatMessage}
              disabled={isLoadingPost}
              onKeyPress={(e) => {if(e.charCode === 13) sendMessage()}}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {setChatMessage(e.target.value);}}
            />
            <Button
              variant="outline-secondary"
              className={`text-dark ${CHAT_STATE_TO_BG_COLOR[chatState]}`}
              style={{maxWidth: "95%"}}
              onClick={sendMessage}
              disabled={isLoadingPost}
              >
                {
                  isLoadingPost ? <Spinner animation="border" size={"sm"} /> : <AiOutlineArrowRight color='black' size={16} />
                }
              </Button>
          </InputGroup>
            {errorPost && <span style={{fontStyle: 'italic', color: 'grey'}}>{errorPost.message}</span>}
        </Container>
        </div>
      </Collapse>

        </div>
        </Container>
    </div>
  )
}

export default Chat;