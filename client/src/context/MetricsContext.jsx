import React, {createContext, useEffect, useState} from 'react'
import { socket, getToken } from './socket';

export const MetricsContext = createContext();

export const MetricsProvider = ({children}) =>{
  //getting data from socket
    const [metrics, setMetrics] = useState({ temp: null, salt: null, limits: null });

    //graphs history
      const [history, setHistory] = useState({temp: [], salt: []});

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
// console.log("🔥 ПРИШЛИ МЕТРИКИ С БЕКЕНДА:", BEmetrics); // for debug
      
      setMetrics(BEmetrics);

      setHistory((prev) => {
        // 1. Подстраховка: если массивов еще нет, используем пустые []
        const safeTemp = Array.isArray(prev?.temp) ? prev.temp : [];
        const safeSalt = Array.isArray(prev?.salt) ? prev.salt : [];

        // 2. Добавляем новую точку в конец массива
        const nextTemp = [...safeTemp, { value: Number(BEmetrics.temp) }];
        const nextSalt = [...safeSalt, { value: Number(BEmetrics.salt) }];

        // 3. Возвращаем объект, обрезая длину до 20 последних точек
        return { 
          temp: nextTemp.slice(-20), 
          salt: nextSalt.slice(-20) 
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
