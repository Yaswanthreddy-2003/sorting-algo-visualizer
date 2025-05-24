import React, { useState } from 'react';
import Visualizer from './components/visualizer';
import './App.css';
import ThemeContext from './ThemeContext';
import Login from './components/Login';

const algorithmDescriptions = {
    1: { name: 'Bubble Sort', desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.' },
    2: { name: 'Selection Sort', desc: 'Selects the minimum element from the unsorted part and puts it at the beginning.' },
    3: { name: 'Insertion Sort', desc: 'Builds the sorted array one item at a time by comparing and inserting elements.' },
    4: { name: 'Merge Sort', desc: 'Divides the array into halves, sorts them and merges them back.' },
    5: { name: 'Quick Sort', desc: 'Divides the array using a pivot and sorts the partitions recursively.' },
    6: { name: 'Heap Sort', desc: 'Converts the array into a heap and repeatedly extracts the maximum.' },
    7: { name: 'Twist Sort', desc: 'A hybrid of merge and insertion sort for improved efficiency.' }
};

// Parent Component
function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [algorithm, setAlgorithm] = useState(1);
    const [user, setUser] = useState(null);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleAlgorithmChange = (algo) => setAlgorithm(algo);
    const handleLogin = (username) => setUser(username);

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <ThemeContext.Provider value={theme}>
            <div className={`app-container ${theme}`}>
                <button className="theme-toggle" onClick={toggleTheme}>
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
                <div className="algorithm-info">
                    <h2>{algorithmDescriptions[algorithm].name}</h2>
                    <p>{algorithmDescriptions[algorithm].desc}</p>
                </div>
                <Visualizer onAlgorithmChange={handleAlgorithmChange} />
            </div>
        </ThemeContext.Provider>
    );
}
 
export default App;