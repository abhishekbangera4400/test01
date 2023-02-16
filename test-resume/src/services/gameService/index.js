

class GameService {
   async joinGameRoom(socket, roomId){
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

 async updateGame(socket, gameMatrix) {
    socket.emit("update_game", { matrix: gameMatrix });
  }

   async onGameUpdate(
    socket,
    listiner
  ) {
    socket.on("on_game_update", ({ matrix }) => listiner(matrix));
  }

   async onStartGame(
    socket,
    listiner
  ) {
    socket.on("start_game", listiner);
  }

   async gameWin(socket, message) {
    socket.emit("game_win", { message });
  }

 async onGameWin(socket, listiner) {
    socket.on("on_game_win", ({ message }) => listiner(message));
  }
}

export default new GameService()
