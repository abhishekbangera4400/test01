// Importing the required components
import Board from './Components/Board';
import Info from "./Components/Info";

// Importing the CSS File
import "./App.css";

// Importing the useState hook
import { useState } from 'react';
import Result from './Components/Result';

function App() {

	// Creating a reset state, which indicates whether
	// the game should be reset or not
	const [reset, setReset] = useState(false);

	// Creating a winner state, which indicates
	// the current winner
	const [winner, setWinner] = useState('');

	// Sets the reset property to true
	// which starts the chain
	// reaction of resetting the board
	const resetBoard = () => {
		setReset(true);
	}

	return (
		<div className="App">
			{winner!=="" &&
			<Result reset={()=>{
				setReset(true)
				setWinner("")
			}}
			winner={winner}/>
			}
			{winner==="" &&
			<>
			 <Board reset={reset} setReset={setReset} winner={winner}
				setWinner={setWinner} />
			<Info /></>}
		</div>
	);
}

export default App;
