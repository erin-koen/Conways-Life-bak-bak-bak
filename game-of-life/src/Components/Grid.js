import React, { Component } from 'react';
import Row from './Row.js';

class Grid extends Component {
	state = {
		grid: [[]],
		size: 0,
		generation: 0,
		running: false
	};

	componentDidMount() {
		// this.updateGrid();
	}

	gridHelper() {
		// pull the size off of state
		const int = parseInt(this.state.size);
		// create the grid array
		const grid = [];
		// fill the grid with arrays of length int, each item in which is false
		for (let i = 0; i < int; i++) {
			grid[i] = new Array(int).fill(false);
		}
		// send it back to the function that called it
		return grid;
	}

	findNeighbors(x, y, arr) {
		// pass in coordinates and an array

		// this is likely unnecessary, as you just need to know alive, but this is what will be returned
		const count = {
			alive: 0,
			dead: 0
		};
		console.log('x: ', x);
		console.log('y: ', y);
		console.log(arr[x][y]);
		// y = row, x = column
		// check each direction and increment count if necessary n(1)

		// North
		if (y < this.state.size - 1) {
			if (arr[x][y + 1]) {
				count.alive++;
			}
		}
		// East
		if (x < this.state.size - 1 && y < this.state.size - 1) {
			if (arr[x + 1][y + 1]) {
				count.alive++;
			}
		}
		// South
		if (y >= 1) {
			if (arr[x][y - 1]) {
				count.alive++;
			}
		}
		// West
		if (x >= 1) {
			if (arr[x - 1][y]) {
				count.alive++;
			}
		}
		// Northwest
		if (x >= 1 && y < this.state.size - 1) {
			if (arr[x - 1][y + 1]) {
				count.alive++;
			}
		}
		// Northeast
		if (x < this.state.size - 1 && y < this.state.size - 1) {
			if (arr[x + 1][y + 1]) {
				count.alive++;
			}
		}
		// Southeast
		if (y >= 1 && x < this.state.size - 1) {
			if (arr[x + 1][y - 1]) {
				count.alive++;
			}
		}
		// Southwest
		if (x >= 1 && y >= 1) {
			if (arr[x - 1][y - 1]) {
				count.alive++;
			}
		}
		console.log(count);
		return count;
	}

	updateGrid() {
		// O(n^2) but capped at size of grid.
		// check that the grid has been configured

		console.log('updating');
		// declare variables that you'll manipulate and eventually set to state
		const newGrid = this.gridHelper();
		const newGen = this.state.generation + 1;
		// loop through outer array
		for (let i = 0; i < newGrid.length; i++) {
			// loop through each inner array
			for (let j = 0; j < newGrid[i].length; j++) {
				// call helper function to inspect grid in state, returns an object with { alive: #, dead: # }
				const { alive } = this.findNeighbors(i, j, this.state.grid);
				// if this cell is alive check the Conway conditions
				if (this.state.grid[i][j]) {
					console.log('first conditional - live cell');
					console.log('live neighbors: ', alive);
					// live cell with fewer than two live neighbors, kill it
					if (alive < 2) {
						console.log('second conditional - kill it');

						newGrid[i][j] = false;
					}
					// live cell with greater than three live neighbors, kill it
					if (3 < alive) {
						console.log('third conditional - kill it');

						newGrid[i][j] = false;
					}
					// live cell with 2 or three live neighbors, it lives on
					else {
						console.log('4th conditional - it lives on');

						newGrid[i][j] = true;
					}
				}
				// else the cell is dead, check the Conway conditions
				else {
					console.log('5th conditional - dead cell');
					console.log('live neighbors: ', alive);
					// dead cell with 3 live neighbors, lazarous
					if (alive > 3) {
						console.log('6th conditional - it rises');
						newGrid[i][j] = true;
					}
				}
			}
		}
		console.log('grid in state: ', this.state.grid);
		console.log('new grid: ', newGrid);
		// update state with the new grid, increment the generation
		this.setState({
			grid: newGrid,
			generation: newGen
		});
	}

	// called by submitting the form, which sets the size of the grid in state
	createGrid = e => {
		e.preventDefault();
		// create a new empty grid
		const newGrid = this.gridHelper();
		// set it to state
		this.setState({
			grid: newGrid,
			generation: 1
		});
	};

	toggleCell = (y, x) => {
		//  y = row, x = column
		// create a copy of the grid in state
		const newGrid = this.state.grid;
		// check you're changing the right value
		console.log('row = ', y, 'column = ', x);
		console.log('target value: ', newGrid[y][x]);
		// toggle value in copy of grid
		newGrid[y][x] = !newGrid[y][x];
		// setState w/ updated grid
		this.setState({
			grid: newGrid
		});
	};

	changeHandler = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	startGame = e => {
		e.preventDefault();
		this.gameInterval = setInterval(()=>this.updateGrid(), 25);
	};

	endGame = e => {
		e.preventDefault();
		clearInterval(this.gameInterval);
	};

	render() {
		if (this.state.generation === 0) {
			return (
				<form onSubmit={this.createGrid}>
					<input
						type="number"
						value={this.state.size}
						name="size"
						placeholder="how big would you like your square?"
						onChange={this.changeHandler}
					/>
					<button type="submit">SUBMIT</button>
				</form>
			);
		} else {
			return (
				<div>
					{this.state.grid.map((row, idx) => (
						<Row
							key={idx}
							// pass in the row values
							cells={row}
							// pass down the row coordinate
							yCoord={idx}
							// whether the game is running
							running={this.state.running}
							// drill down the toggle method
							toggle={this.toggleCell}
						/>
					))}
					<button onClick={this.startGame}>START IT</button>
					<button onClick={this.endGame}>END IT</button>
				</div>
			);
		}
	}
}

export default Grid;
// this.state.grid.map((row, idx) =>
// 	<Row
// 		key={idx}
// 		// pass in the row values
// 		cells={row}
// 		// pass down the row coordinate
// 		yCoord={idx}
// 		// whether the game is running
// 		running={this.state.running}
// 		// drill down the toggle method
// 		toggle={this.toggleCell}
// 		/>
// )
