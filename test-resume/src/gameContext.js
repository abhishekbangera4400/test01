import React from "react";

const defaultState = {
  isInRoom: false,
  setInRoom: () => {},
  playerSymbol: "x",
  setPlayerSymbol: () => {},
  isPlayerTurn: false,
  setPlayerTurn: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
  isGameWon: false,
  setGameWon: () => {},
  roomID: "",
  setRoomID:() => {},
};

export default React.createContext(defaultState);
