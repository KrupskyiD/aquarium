import { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client';
import ProfilePage from './features/user/pages/ProfilePage';
import AquariumManagePage from './features/user/pages/AquariumManagePage';

const socket = io.connect('http://localhost:3001');

function App() {

  const [metrics, setMetrics] = useState({ temp: 0, salt: 0 });
  
  const [currentScreen, setCurrentScreen] = useState('profile');

  useEffect(() => {
    socket.on('dashboard-metrics', (BEmetrics) => {
      setMetrics(BEmetrics)
    });
  }, [])

  return (
    <div className="App bg-[#0B1120] min-h-screen">
      { }
      {currentScreen === 'profile' && (
        <ProfilePage onNavigate={setCurrentScreen} />
      )}
      
      { }
      {currentScreen === 'aquarium' && (
        <AquariumManagePage 
          onNavigate={setCurrentScreen} 
          temp={metrics.temp} 
          salt={metrics.salt} 
        />
      )}
    </div>
  )
}

export default App;