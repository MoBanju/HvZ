import { IChat } from "../../models/IChat";

function Chat({chatmessages}: {chatmessages: IChat[]}) {
  return (
    <>
    {chatmessages.map(chat => <p>{chat.message}</p>)}
    </>
  )
}

export default Chat;