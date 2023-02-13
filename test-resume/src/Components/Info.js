// Importing the css for the info
import React,{useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faUsers,faLaptop } from '@fortawesome/fontawesome-free-solid'

import "./info.css";

const Info = () => {
    const [multiplayer, setMultiplayer] = useState(false);
	return (
		<div className="info">
			<div className="player"><FontAwesomeIcon icon={faUser} />: X</div>
			<div className="player"><FontAwesomeIcon icon={multiplayer?faLaptop:faUsers} />: O</div>
            
            <div onClick={()=>{setMultiplayer(!multiplayer)}} className="multiplayer player br-0"><FontAwesomeIcon icon={multiplayer? faUsers:faUser} /></div>
		</div>
	)
}

export default Info;
