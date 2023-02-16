// Importing the required components
import React, { useEffect, useState } from "react";
import Board from "./Components/Board";
import socketService from "./services/socketService";
import GameContext from "./gameContext";
import gameService from "./services/gameService";

// Importing the CSS File
import "./App.css";
import Room from "./Components/Room/Room";
import { ColorRing } from "react-loader-spinner";
import vsLogo from'./Images/vs01.png';


function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loaderText, setLoaderText] = useState("");
  const [roomID, setRoomID] = useState("")

  const [roomName, setRoomName] = useState("123");
  const [isJoining, setJoining] = useState(false);

  // Creating a reset state, which indicates whether
  // the game should be reset or not
  const [reset, setReset] = useState(false);

  // Creating a winner state, which indicates
  // the current winner
  const [winner, setWinner] = useState("");

  // Sets the reset property to true
  // which starts the chain
  // reaction of resetting the board
  const resetBoard = () => {
    setReset(true);
  };

  const connectSocket = async () => {
    setLoaderText("Connecting...")
    const socket = await socketService
      .connect("https://tic-tac-toe-server-qwvd.onrender.com/")
      .then((res) => {
        if (res?.connected) {
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
      socketService.socket.on("connect", () => {
        setLoader(false);
    });
    socketService.socket.on("disconnect", () => {
      console.log("Disconnected"); // undefined
    });
  };

  useEffect(() => {
    if (!socketService.socket) {connectSocket()}
  }, []);

  const joinRoom = async (value) => {
    // e.preventDefault();
    const socket = socketService.socket;
    if (!value || value.trim() === "" || !value) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, value)
      .catch((err) => {
        alert(err);
      });
     //load start game
        if (socketService.socket)
          gameService.onStartGame(socketService.socket, (options) => {
            setGameStarted(true);
            setPlayerSymbol(options.symbol);
            if (options.start) setPlayerTurn(true);
            else setPlayerTurn(false);
          });

    if (joined){
      setInRoom(true);
      setRoomID(value)
    } 

    setJoining(false);
  };

  const gameContextValue = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    isGameWon,
    setGameWon,
    roomID,
    setRoomID
  };



  return (
    <GameContext.Provider value={gameContextValue}>
      {loader &&
       <div className="loader-react">
      <ColorRing
        visible={loader}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
      {loader && <span style={{color:"#fff"}}>{loaderText}</span>}
      </div>}
      <div className={`App ${loader?"bg-blur":""}`}>
        {isInRoom ? (
          <div className="game-main-wrapper w-100 h-100">
            {!isGameWon &&
          <div className="header  w-100 ">
          <div className="header-container  w-100 ">
          <div className="header-flex  w-100 ">
            <div className="header-content" style={{backgroundColor:isPlayerTurn?"#9cdf14":""}}>
            Player 1
          
            </div>
          
            <div className="vs-image" >
            <img  src={vsLogo} className="vs-image-1" alt="fireSpot"/>
  
            </div>
            <div className="header-content" style={{backgroundColor:isPlayerTurn?"":"#9cdf14"}}>
            Player 2
              </div>
            </div>
          </div>
        </div>
}
                <div className="game-body w-100">
                <Board
                  reset={reset}
                  setReset={()=>{joinRoom(roomID)}}
                  winner={winner}
                  setWinner={setWinner}
                  socketService={socketService}
                  setLoader={setLoader}
                  setLoaderText={setLoaderText}
                />
          </div>
          </div>
        ) : (
          <>
            <Room joinRoom={joinRoom} />
          </>
        )}
      </div>
    </GameContext.Provider>
  );
}

export default App;
