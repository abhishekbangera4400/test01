import React from "react";
import ooo from "../Images/o-solid.svg"
import xxx from "../Images/xmark-solid.svg"
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

import "./Result.css";

export default function Result(props) {
  const { reset,winner } = props;
//   const { width, height } = useWindowSize()

  return (
    <>
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
    />
    <div className="winner-result" style={{flexDirection:"column"}} onClick={()=>{reset()}}>
        {winner==="1"?
  <img className="result-image" src={xxx} alt="fireSpot"/>
        :winner==="2"?
        <img className="result-image-o" src={ooo} alt="fireSpot"/>:
        <div className="draw">
        <img className="result-image" src={xxx} alt="fireSpot"/>
        <img className="result-image-o" src={ooo} alt="fireSpot"/>
        </div>
    }
      
      <div className="winner-text-main">{winner==="0"?"Draw!":"Winner!"}</div>
    </div>
    </>
  );
}
