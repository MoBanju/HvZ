function GameDescription({title, description}: {title: string, description: string}) {
  return (
    <div className="d-flex">
    <div className="me-5">
        <h1>{title}</h1>
        <h5 className="w-30">{description}</h5>
    </div>

    <div className="float-end me-5">
      <h3>Rules</h3>
      <h5>
        <ul className="w-30">
          <li className="m-2">People who are not registered players are not allowed to interfere with gameplay. 
            Under the original rules, this includes spying on the other team, 
            or helping players stay in a safe area by bringing them food or doing something 
            for a player which would otherwise require them to leave a safe-zone.</li>
          <li className="m-2">Almost all players begin the game as humans, and must keep their bite code with them at all times in case a zombie attacks them. 
            If they are tagged, they must surrender their code, and become a zombie after one hour has elapsed.</li>
          <li className="m-2">Zombies must gather and input the the bite code of all humans that they "turn" 
            into the database to keep track of which humans have been converted.</li>
        </ul>
      </h5>
    </div>
    </div>
  )
}
export default GameDescription