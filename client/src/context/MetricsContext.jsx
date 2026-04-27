import React, {createContext, useEffect, useState} from 'react'
import { socket } from './socket';

export const MetricsContext = createContext();

export const MetricsProvider = ({children}) =>{
  //getting data from socket
    const [metrics, setMetrics] = useState({ temp: 0, salt: 0, limits: null });

    //changing metrics
  useEffect(() => {
    //connect socket
    socket.connect();

    socket.on("dashboard-metrics", (BEmetrics) => {
      setMetrics(BEmetrics);
    });

    return () => {
      socket.off("dashboard-metrics");
      socket.disconnect();
    };
  }, []);

return (
    <MetricsContext.Provider value={{metrics}}>
        {children}
    </MetricsContext.Provider>
);
}
