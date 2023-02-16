import React, { useState } from "react";
import "./room.scss";

export default function Room(props) {
  const regexOnlyNumber = /^[0-9]+$/;
  const [roomID,setRoomID]=useState("")
  const { joinRoom } = props;
  

  const onChangeInput=(key,event)=>{
    let value = event?.target?.value || ""
switch (key) {
  case "roomID":
if(regexOnlyNumber.test(value)){
  setRoomID(value)
}
    break;

  default:
    break;
}
  }
  return (
    <>
      <h1 className="title-game">TIC TAC TOE</h1>
      <div className="container w-100">
        <div className="container__item" w-100>
          <form className="form">
            <input
              type="email"
              className="form__field"
              placeholder="Enter room ID"
              maxLength="10"
              onChange={(value)=>{
                onChangeInput("roomID",value)}}
              value={roomID}
            />
            <button
              type="button"
              disabled={roomID?.length<3}
              className="btn btn--primary btn--inside uppercase"
              onClick={(e) => {
                joinRoom(roomID);
              }}
            >
              Join
            </button>
          </form>
        </div>
        {/* <div className="container__item">
        <h1 className="post_header">Tic Tac Toe</h1>
        <p className="p-text">
          If tic-tac-toe were as simple as it seems, why has it been around for
          over 3,000 years? Our version has evolved a bit since the original
          version in ancient Egypt, by letting kids play against the computer.
          However, what it teaches kids hasn’t changed.&nbsp;This classic game
          contributes to children’s developmental growth in numerous ways
          including their understanding of predictability, problem solving,
          spatial reasoning, hand-eye coordination, turn taking, and
          strategizing.&nbsp; Teachers trust Toy Theater to provide safe &amp;
          effective educational games. Free to play, priceless to learn.
        </p>
        </div> */}
      </div>
    </>
  );
}
