
import io from 'socket.io-client'
const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:3001";
//getting user token for socket by main key from locall storage
export function getToken() {
  const userToken = localStorage.getItem('saltguard.auth.session');
  if (userToken) {

    //parsing object saltguard.auth.session from local storage in json format
    const parsedObject = JSON.parse(userToken);

    //return user's access token  
    return parsedObject.accessToken;
  };

  //if user isn't logged in
  return null;
}
//replace connecting socket with BE, and giving him token for handshake with BE
export const socket = io.connect(BACKEND_URL, {
  autoConnect: false
});