import { Server } from 'socket.io'

let io;
export const startSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
        },
    });

    io.on('connection', (socket) => {

    });

    return io;
};

export const getIO = () =>{
    //space for initialization ErrorHandler

    return io;
} 