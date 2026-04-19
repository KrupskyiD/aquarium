import { Server } from 'socket.io'
import { customError } from '../src/ErrorHandlers/customError.js';

let io;
export const startSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
        },
    });
    //middleware for socket. Checking user
    io.use((socket, next) => {
        //getting user's token using handshake
        const token = socket.handshake.auth.token;
        if(!token) return next(new customError('No tokens'), 500);

        try {
            //decoding token with JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //saving decoded user's id to socket
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new customError('Invalid token', 500))
        }

    }) 
    io.on('connection', (socket) => {

        //join socket to user's room
        socket.join(socket.user.id.toString());

    });

    return io;
};

export const getIO = () =>{
    //space for initialization ErrorHandler

    return io;
} 