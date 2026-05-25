/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useEffect, useState} from 'react'
import { socket, getToken } from './socket';

export const MetricsContext = createContext();

export const MetricsProvider = ({children}) =>{
  //getting data from socket
    const [metrics, setMetrics] = useState({ temp: null, salt: null, limits: null });

    //graphs history
      const [history, setHistory] = useState({ deviceSerial: null, temp: [], salt: [] });

    //changing metrics
  useEffect(() => {

    const token = getToken();

    if(!token){
      console.warn(`No token, socket isn't connected`);
      return;
    }

    socket.auth = {token};

    //connect socket
    socket.connect();

    socket.on("dashboard-metrics", (BEmetrics) => {
      setMetrics(BEmetrics);

      setHistory((prev) => {
        const deviceSerial = BEmetrics?.device_serial;
        const prevDevice = prev?.deviceSerial;

        if (deviceSerial && prevDevice && deviceSerial !== prevDevice) {
          return {
            deviceSerial,
            temp: [{ value: Number(BEmetrics.temp) }],
            salt: [{ value: Number(BEmetrics.salt) }],
          };
        }

        const safeTemp = Array.isArray(prev?.temp) ? prev.temp : [];
        const safeSalt = Array.isArray(prev?.salt) ? prev.salt : [];

        return {
          deviceSerial: deviceSerial ?? prevDevice ?? null,
          temp: [...safeTemp, { value: Number(BEmetrics.temp) }].slice(-20),
          salt: [...safeSalt, { value: Number(BEmetrics.salt) }].slice(-20),
        };
      });
    });

    return () => {
      socket.off("dashboard-metrics");
      socket.disconnect();
    };
  }, []);

return (
    <MetricsContext.Provider value={{metrics, history}}>
        {children}
    </MetricsContext.Provider>
);
}
