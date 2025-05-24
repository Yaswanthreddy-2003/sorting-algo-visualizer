import React, { useContext } from 'react';
import ThemeContext from '../ThemeContext';

// algorithms
import { bubbleSort } from './algorithms/bubbleSort.js';
import { insertionSort } from './algorithms/insertionSort.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { mergeSort } from './algorithms/mergeSort.js';
import { quickSort } from './algorithms/quickSort.js';
import { heapSort } from './algorithms/heapSort.js';
import { twistSort } from './algorithms/twistSort.js';

// components
import Navbar from './navbar';
import Frame from './frame';
import Footer from './footer';

// helpers
import pause from './helper/pause';
import generator from './helper/generator';
import {ALGORITHM, SPEED, SIZE, SWAP, CURRENT, NORMAL, DONE} from './helper/constants';
import { getKeysCopy } from './helper/keys.js';

class Visualizer extends React.Component {
    /*  each element in the list contains a <key, classType> where:
        key - integer value of element,
        classType - css class for changing color of element
    */
    state = {
        list: [],
        size: 10,
        speed: 1,
        algorithm: 1,
        running: false,
        paused: false,
        comparisons: 0,
        swaps: 0,
        elapsed: 0,
        originalList: [],
        timer: null,
    };

    pauseResolver = null;
    timerInterval = null;

    // for initial generation of list
    componentDidMount() {
        this.generateList();
        if (this.props.onAlgorithmChange) {
            this.props.onAlgorithmChange(this.state.algorithm);
        }
    }

    /* for hooking to the time instant of any change in state/event */
    componentDidUpdate(prevProps, prevState) {
        this.onChange();
        this.generateList();
        if (prevState && prevState.algorithm !== this.state.algorithm && this.props.onAlgorithmChange) {
            this.props.onAlgorithmChange(this.state.algorithm);
        }
    }

    render() { 
        const theme = this.context || 'light';
        return (
            <React.Fragment>
                <Navbar
                    start={this.start}
                    response={this.response}
                    newList={this.generateList}
                    onChange={this.onChange}
                />
                <div style={{textAlign: 'center', margin: '10px'}}>
                    {this.state.running && !this.state.paused && (
                        <button onClick={this.handlePause} style={{marginRight: '10px'}}>Pause</button>
                    )}
                    {this.state.running && this.state.paused && (
                        <button onClick={this.handleResume} style={{marginRight: '10px'}}>Resume</button>
                    )}
                    <button onClick={this.resetList} style={{marginLeft: '10px'}}>Reset</button>
                </div>
                <div className="stats-bar" style={{display:'flex',justifyContent:'center',gap:'2.5rem',marginBottom:'10px',fontWeight:'bold',fontSize:'1.1rem'}}>
                    <span>Comparisons: {this.state.comparisons}</span>
                    <span>Swaps: {this.state.swaps}</span>
                    <span>Elapsed: {this.state.elapsed}s</span>
                </div>
                <Frame 
                    list={this.state.list}
                />
                <Footer />
            </React.Fragment>
        );
    }

    // for updating the state on changing navbar options
    // avoid changing algorithm and size when algorithm is running
    onChange = (value, option) => {
        if(option === ALGORITHM && !this.state.running) {
            this.setState({ algorithm: Number(value) });
        }
        else if(option === SPEED) {
            this.setState({ speed: Number(value) });
        }
        else if(option === SIZE && !this.state.running) {
            this.setState({ size: Number(value) });
            this.generateList();
        }
    };

    // generate a random list
    generateList = (value = 0) => {
        if((this.state.list.length !== this.state.size && !this.state.running) || Number(value) === 1) {
            let list = generator(this.state.size);
            this.setState({ list: list, originalList: list.map(e => ({...e})), comparisons: 0, swaps: 0, elapsed: 0 });
        }
	};

    resetList = () => {
        this.setState({
            list: this.state.originalList.map(e => ({...e})),
            comparisons: 0,
            swaps: 0,
            elapsed: 0,
            running: false,
            paused: false
        });
        clearInterval(this.timerInterval);
    };

    // select and run the corresponding algorithm  
    start = async() => {
        this.lock(true);
        this.setState({ comparisons: 0, swaps: 0, elapsed: 0 });
        this.startTimer();
        let moves = await this.getMoves(this.state.algorithm);
        await this.visualizeMoves(moves);
        await this.done();
        this.lock(false);
        this.stopTimer();
    };

    startTimer = () => {
        this.setState({ elapsed: 0 });
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.setState(prev => ({ elapsed: prev.elapsed + 1 }));
        }, 1000);
    };
    stopTimer = () => {
        if (this.timerInterval) clearInterval(this.timerInterval);
    };

    // get moves for corresponding algorithms
    getMoves = async(Name) => {
        let moves = [];
        let array = await getKeysCopy(this.state.list, this.state.size);
        if(Name === 1) {
            moves = await bubbleSort(array, array.length);
        }
        if(Name === 2) {
            moves = await selectionSort(array, array.length);
        }
        if(Name === 3) {
            moves = await insertionSort(array, array.length);
        }
        if(Name === 4) {
            moves = await mergeSort(array, array.length);
        }
        if(Name === 5) {
            moves = await quickSort(array, array.length);
        }
        if(Name === 6) {
            moves = await heapSort(array, array.length);
        }
        if(Name === 7) {
            moves = await twistSort(array, array.length);
        }
        return moves;
    };

    // for visualizing obtained moves
    visualizeMoves = async(moves) => {
        if(moves.length === 0) {
            return;
        }
        // if move length if 4, then we have to handle range part
        if(moves[0].length === 4) {
            await this.visualizeMovesInRange(moves);
        }
        else {
            await this.visualizeMovesBySwapping(moves);
        }
    };

    // for visualizing range based sorting algorithms
    visualizeMovesInRange = async(Moves) => {
        let prevRange = [];
        while (Moves.length > 0 && Moves[0].length === 4) {
            // change range only when required to avoid blinking
            if(prevRange !== Moves[0][3]) {
                await this.updateElementClass(prevRange, NORMAL);
                prevRange = Moves[0][3];
                await this.updateElementClass(Moves[0][3], CURRENT);
            }
            await this.updateElementValue([Moves[0][0], Moves[0][1]]);
            Moves.shift();
        }
        await this.visualizeMoves(Moves);
    };

    // for visualizing swapping based sorting algorithms
    visualizeMovesBySwapping = async(Moves) => {
        while(Moves.length > 0) {
            let currMove = Moves[0];
            // if container doesn't contains 3 elements then return
            if(currMove.length !== 3) {
                await this.visualizeMoves(Moves);
                return;
            }
            else {
                let indexes = [currMove[0], currMove[1]];
                await this.updateElementClass(indexes, CURRENT);
                await this.updateStateChanges([...this.state.list], true, false); // count as comparison
                if(currMove[2] === SWAP) {
                    await this.updateList(indexes);
                    await this.updateStateChanges([...this.state.list], false, true); // count as swap
                }
                await this.updateElementClass(indexes, NORMAL);
            }
            Moves.shift();
        }
    };

    // swapping the values for current move
    updateList = async(indexes) => {
        let array = [...this.state.list];
        let stored = array[indexes[0]].key;
        array[indexes[0]].key = array[indexes[1]].key;
        array[indexes[1]].key = stored;
        await this.updateStateChanges(array);
    };

    // update value of list element
    updateElementValue = async(indexes) => {
        let array = [...this.state.list];
        array[indexes[0]].key = indexes[1];
        await this.updateStateChanges(array);
    };

    // update classType of list element
    updateElementClass = async(indexes, classType) => {
        let array = [...this.state.list];
        for(let i = 0 ; i < indexes.length ; ++i) {
            array[indexes[i]].classType = classType;
        }
        await this.updateStateChanges(array);
    };

    // Updating the state attribute list every time on modification
    updateStateChanges = async(newList, isComparison = false, isSwap = false) => {
        this.setState(prev => ({
            list: newList,
            comparisons: prev.comparisons + (isComparison ? 1 : 0),
            swaps: prev.swaps + (isSwap ? 1 : 0)
        }));
        await pause(this.state.speed);
        await this.checkPaused();
    };

    // Add pause and resume methods
    handlePause = () => {
        this.setState({ paused: true });
    };
    handleResume = () => {
        this.setState({ paused: false }, () => {
            if (this.pauseResolver) {
                this.pauseResolver();
                this.pauseResolver = null;
            }
        });
    };

    // Helper to await pause
    checkPaused = async () => {
        if (this.state.paused) {
            await new Promise(resolve => {
                this.pauseResolver = resolve;
            });
        }
    };

    // To block changing of navbar options when the algorithm is running
    lock = (status) => {
        this.setState({ running: Boolean(status) });
    };

    // Mark list as done
    done = async() => {
        let indexes = [];
        for(let i = 0 ; i < this.state.size ; ++i) {
            indexes.push(i);
        }
        await this.updateElementClass(indexes, DONE);
    };
    
    // For responsive navbar
    response = () => {
        let Navbar = document.querySelector(".navbar");
        if(Navbar.className === "navbar") Navbar.className += " responsive";
        else Navbar.className = "navbar";
    };
}
Visualizer.contextType = ThemeContext;
 
export default Visualizer;