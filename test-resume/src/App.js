// Importing the required components
import React, { useEffect, useState } from "react";
import Board from "./Components/Board";
import Info from "./Components/Info";
import socketService from "./services/socketService";
import GameContext from "./gameContext";
import gameService from "./services/gameService";

// Importing the CSS File
import "./App.css";
import Result from "./Components/Result";
import Room from "./Components/Room/Room";
import { ColorRing } from "react-loader-spinner";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loaderText, setLoaderText] = useState("");


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
      console.log("connected"); // x8WIv7-mJelg7on_ALbx
    });
    socketService.socket.on("disconnect", () => {
      console.log("Disconnected"); // undefined
    });
  };

  useEffect(() => {
    if (!socketService.socket) connectSocket();
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

    if (joined) setInRoom(true);

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
          <>
            {winner !== "" && (
              <Result
                reset={() => {
                  setReset(true);
                  setWinner("");
                }}
                winner={winner}
              />
            )}
            {winner === "" && (
              <>
                <Board
                  reset={reset}
                  setReset={setReset}
                  winner={winner}
                  setWinner={setWinner}
                  socketService={socketService}
                  setLoader={setLoader}
                  setLoaderText={setLoaderText}
                />
                <Info />
              </>
            )}
          </>
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
