import { IChat } from "../../models/IChat";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, Collapse, Container, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IPlayer } from '../../models/IPlayer';
import { PostChatMessageAction } from "../api/postChatMessage";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import GetChatByGameIdAction from "../api/getChatByGameId";
import React, { ChangeEvent, CSSProperties, useEffect, useRef, useState } from "react";
import {TbArrowsVertical} from "react-icons/tb"

enum ChatState {
  GLOBAL,
  HUMAN,
  ZOMBIE,
}

const FETCH_CHAT_INTERVAL = 5000;

const CHAT_STATE_TO_BG_COLOR = ["bg-primary", "bg-success", "bg-danger"];

var TIMER: NodeJS.Timer;


function Chat({gameId, currentPlayer}: { gameId: number, currentPlayer: IPlayer | undefined}) {

  
  const [chatState, setChatState] = useState<ChatState>(ChatState.GLOBAL);
  const [chatMessage, setChatMessage] = useState("");
  const [chatStyle, setChatStyle] = useState<CSSProperties>({backgroundColor: "#0d6efd !important", maxWidth: "55%"});
  const dispatch = useAppDispatch();
  const chatmessages = useAppSelector(state => state.game.chat);
  const [isLoadingPost, errorPost] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostChatMessage);
  const [isLoadingGet, errorGet] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetChatByGameId);
  const [isCollapseOpen, setCollapse] = React.useState(false)

  const chatMsgContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    return () => {clearInterval(TIMER);};
  }, [])

  useEffect(() => {
    switch(chatState){
      case ChatState.HUMAN:
        setChatStyle({backgroundColor: "#5cb85c !important", maxWidth: "55%"});
        break;
      case ChatState.ZOMBIE:
        setChatStyle({backgroundColor: "#dc3545 !important", maxWidth: "55%"});
        break;
      case ChatState.GLOBAL:
        setChatStyle({backgroundColor: "#0d6efd !important", maxWidth: "55%"});
        break;
    }
  }, [chatState])
  
  const fetchChat = () => {
    dispatch(GetChatByGameIdAction(gameId));
  }
  
  
  if(errorPost)
  return <p>{errorPost.message}</p>
  
  if(!currentPlayer)
  return null;
  
  const isHuman = currentPlayer.isHuman;
  const isZombie = !isHuman;
  
  
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
      case ChatState.HUMAN:
        return chatMessage.isHumanGlobal && isHuman;
      case ChatState.ZOMBIE:
        return chatMessage.isZombieGlobal && isZombie;
      case ChatState.GLOBAL:
        return !chatMessage.isHumanGlobal && !chatMessage.isZombieGlobal
      default:
        return false;
    }
  };

  const scrollToBottomOfChat = () => {
    chatMsgContainerRef.current?.scrollIntoView({behavior: "smooth"});
  }

  const sendMessage = () => {
    let isHumanGlobal: boolean, isZombieGlobal: boolean;

    switch (chatState) {
      case ChatState.HUMAN:
        isHumanGlobal = true;
        isZombieGlobal = false;
        break;
      case ChatState.ZOMBIE:
        isHumanGlobal = false;
        isZombieGlobal = true;
        break;
      case ChatState.GLOBAL:
        // Fallthrough
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
      player: currentPlayer,
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
          style={{width:"45%"}}
        >
          Global
        </Button>
        {isHuman && <Button
          onClick={() => { setChatState(ChatState.HUMAN) }}
          className={`nav-link p-2 text-success ${chatState === ChatState.HUMAN ? "active" : ""}`}
          style={{width:"45%"}}
        >
          Human
        </Button>}
        {isZombie && <Button
          onClick={() => { setChatState(ChatState.ZOMBIE) }}
          className={`nav-link p-2 text-danger ${chatState === ChatState.ZOMBIE ? "active" : ""}`}
          style={{width:"45%"}}
        >
          Zombie
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
                className={`mb-1 ${CHAT_STATE_TO_BG_COLOR[chatState]} rounded p-3 m-2 ${currentPlayer == chat.player ? "align-self-end" : "align-self-start"} mw-50 text-break`}
                style={{maxWidth: "55%"}}
                >
                  ({chat.player.user.firstName}) {chat.message}
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
              >
                Message
              </InputGroup.Text>
            <FormControl
              name="message"
              placeholder="glhf evry1"
              aria-label="Message"
              aria-describedby="message"
              value={chatMessage}
              disabled={isLoadingPost}
              onKeyPress={(e) => {if(e.charCode === 13) sendMessage()}}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {setChatMessage(e.target.value);}}
            />
            <Button
              variant="outline-secondary"
              className="input-group-text"
              style={{maxWidth: "95%"}}
              onClick={sendMessage}
              disabled={isLoadingPost}
              >
                {
                  isLoadingPost ? <Spinner animation="border" size={"sm"} /> : <AiOutlineArrowRight color="#1976D2" size={16} />
                }
              </Button>
          </InputGroup>
        </Container>
        </div>
      </Collapse>

        </div>
        </Container>
    </div>
  )
}

export default Chat;