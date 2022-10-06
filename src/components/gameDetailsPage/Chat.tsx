import { IChat } from "../../models/IChat";
import { AiOutlineArrowRight } from "react-icons/ai";
import React, { ChangeEvent, useState } from "react";
import { Button, Container, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { submitChatMessageAction } from "../../store/middleware/submitChatMessageMiddleware";

enum ChatState {
  GLOBAL,
  HUMAN,
  ZOMBIE,
}

function Chat({ chatmessages }: { chatmessages: IChat[] }) {
  const [chatState, setChatState] = useState<ChatState>(ChatState.GLOBAL);
  const [chatMessage, setChatMessage] = useState("");
  const isLoading = useAppSelector(state => state.game.sendingMessage);
  const dispatch = useAppDispatch();

  const isHuman = true;
  const isZombie = false;

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
    
    const action = submitChatMessageAction(0, {chatTime: "QQ", isHumanGlobal, isZombieGlobal, message: chatMessage})
    dispatch(action)
    setChatMessage("");
  };

  return (
    <Container className="bg-dark position-absolute bottom-0 end-0 h-50 w-25 p-0 rounded">
      <ul className="nav nav-tabs justify-content-around" role="tablist">
        <Button
          onClick={() => { setChatState(ChatState.GLOBAL) }}
          className={`nav-link p-2 text-primary ${chatState === ChatState.GLOBAL ? "active" : ""}`}
        >
          Global
        </Button>
        {isHuman && <Button
          onClick={() => { setChatState(ChatState.HUMAN) }}
          className={`nav-link p-2 text-success ${chatState === ChatState.HUMAN ? "active" : ""}`}
        >
          Human
        </Button>}
        {isZombie && <Button
          onClick={() => { setChatState(ChatState.ZOMBIE) }}
          className={`nav-link p-2 text-danger ${chatState === ChatState.ZOMBIE ? "active" : ""}`}
        >
          Zombie
        </Button>}
      </ul>
      <Container className="scroll m-1 d-flex flex-column">
        {chatmessages
          .filter(filterChat)
          .map((chat, i) =>
            <p
              key={i}
              className={`bg-danger rounded p-3 m-2 ${i% 2 === 0 ? "align-self-end" : "align-self-start"} mw-50 text-break`}
              style={{maxWidth: "55%"}}
              >
                ({chat.chatTime}) {chat.message}
              </p>
            )}
      </Container>

      <Container>
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
            disabled={isLoading}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {setChatMessage(e.target.value);}}
          />
          <Button
            variant="outline-secondary"
            className="input-group-text"
            style={{maxWidth: "95%"}}
            onClick={sendMessage}
            disabled={isLoading}
            >
              {
                isLoading ? <Spinner animation="border" size={"sm"} /> : <AiOutlineArrowRight color="#1976D2" size={16} />
              }
            </Button>
        </InputGroup>
      </Container>
    </Container>
  )
}

export default Chat;