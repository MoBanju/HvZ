import { Container } from "react-bootstrap";
import { icons } from "react-icons/lib";
import { IChat } from "../../models/IChat";
import {AiOutlineArrowRight} from "react-icons/ai";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";

function Chat({chatmessages}: {chatmessages: IChat[]}) {
  return (
    <div className="chat bg-dark mt-5 position-fixed bottom-0 me-auto">
      <header className="chat-header m-3">
          <button className="m-2 btn-delete text-primary">Global</button>
          <button className="m-2 btn-delete text-success">Human</button>
      </header>
      <div className="m-3 bg-dark modal-body">
        <div className="scroll m-1">
          {chatmessages.map((chat, i) => <p key={i} className="bg-primary bg rounded p-3 m-2">({chat.chatTime}) {chat.message}</p>)}
        </div>

        <div>
          <input type="text" className="rounded p-2 m-3" />
          <button className="btn-delete"><AiOutlineArrowRight color="#1976D2" size={30}/></button>
        </div>
      </div>
    </div>
  )
}

export default Chat;