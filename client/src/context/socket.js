
import io from 'socket.io-client'

//getting user token for socket by main key from locall storage
function getToken(userToken) {
  userToken = localStorage.getItem('saltguard.auth.session');
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
export const socket = io.connect("http://localhost:3001", {
  auth: {
    token: getToken()
  }
});