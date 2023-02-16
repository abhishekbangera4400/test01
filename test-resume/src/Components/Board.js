import { useState, useEffect, useContext, useRef } from "react";
import "./board.css";
import gameContext from "../gameContext";
import gameService from "../services/gameService";
import socketService from "../services/socketService"
import Result from "./Result";
import Info from "./Info";
import vsLogo from'../Images/vs01.png';

// Importing the useState hook, useEffect hook and useRef hook

const Board = ({ reset, setReset, setLoaderText, setLoader }) => {
  const [matrix, setMatrix] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const {
    playerSymbol,
    setPlayerSymbol,
    setPlayerTurn,
    isPlayerTurn,
    setGameStarted,
    isGameStarted,
    isGameWon,
    setGameWon
  } = useContext(gameContext);

  const checkGameState = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  };
  const updateGameMatrix = (column, row, symbol) => {
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        gameService.gameWin(socketService.socket, "The Game is a TIE!");
        setMatrix([
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ])
        setGameWon("xo")
      } else if (currentPlayerWon && !otherPlayerWon) {
        gameService.gameWin(socketService.socket, playerSymbol);
        setMatrix([
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ])
        setGameWon(playerSymbol)
      }

      setPlayerTurn(false);
    }
  };
  const handleGameUpdate = () => {
    if (socketService.socket)
      gameService.onGameUpdate(socketService.socket, (newMatrix) => {
        setMatrix(newMatrix);
        checkGameState(newMatrix);
        setPlayerTurn(true);
      });
  };

  const handleGameStart = () => {
    console.log(socketService.socket)
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, (options) => {
        setGameWon(false)
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
      });
  };

  const handleGameWin = () => {
    if (socketService.socket)
      gameService.onGameWin(socketService.socket, (message) => {
        setPlayerTurn(false);
        setGameWon(message)
      });
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, [])
  

  useEffect(() => {
    if(!isGameStarted){
      setLoader(true)
      setLoaderText("Waiting for Other Player to Join to Start the Game!")
    }else{
      setLoader(false)
    }
  }, [isGameStarted,isPlayerTurn])

  return (
    isGameWon?
      <Result
      reset={() => {
        // setReset()
        setGameWon(false)
        updateGameMatrix(1, 1, null)
        // setWinner("");
      }}
      winner={isGameWon}
    />
      :
      <>
      
    <div className="board">
      {!isGameStarted && (
        <>
        {/* <h2>Waiting for Other Player to Join to Start the Game!</h2> */}
      </>
      )}
      {/* {(!isGameStarted || !isPlayerTurn) && <PlayStopper />} */}
      {matrix.map((row, rowIdx) => {
        return (
          <>
            {row.map((column, columnIdx) => (
              <div
              style={{color:column === "x"?"rgb(84, 84, 84)" : "rgb(242, 235, 211)",cursor:(!isGameStarted || !isPlayerTurn)?"not-allowed":""}}
                className={`input input-${
                  rowIdx === 2 ? columnIdx + 7 : columnIdx + 1
                }`}
                onClick={(e) =>{
                  if(isGameStarted && isPlayerTurn)
                  updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                }
                }
              >
                {column && column !== "null"
                  ? column === "x"
                    ? "X"
                    : "O"
                  : null}
              </div>
            ))}
          </>
        );
      })}
    </div>
    </>
  );
};

export default Board;
