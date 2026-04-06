import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react'

const socket = io.connect('http://localhost:3001');

function App() {

  //hooks for metricks
  const [metrics, setMetrics] = useState({ temp: 0, salt: 0 });
  useEffect(() => {
    socket.on('dashboard-metricks', (BEmetrics) => {
      setMetrics(BEmetrics)
    });
  }, [])
  return (
    <div>
      <h1>METRICS:</h1>
      <p>Temperature: {metrics.temp}</p>
      <p> Salinity: {metrics.salt}</p>
    </div>
  );
}

export default App;
