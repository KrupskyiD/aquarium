import { Server } from 'socket.io'
import { customError } from '../src/ErrorHandlers/customError.js';
import jwt from 'jsonwebtoken';

let io;
export const startSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });
    //middleware for socket. Checking user
    io.use((socket, next) => {
        // console.log("-> [Сокет] Кто-то пытается подключиться...");
        //getting user's token using handshake
        const token = socket.handshake.auth.token;
        if(!token) {
            // console.log("-> [Сокет] Отклонено: нет токена");
            return next(new customError('No tokens', 500)); // Запятая была пропущена в твоем коде? Должно быть 500 в объекте или как аргумент
        }

        try {
            //decoding token with JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
// console.log("-> [Сокет] Токен успешен! Декодировано:", decoded);
            //saving decoded user's id to socket
            socket.user = decoded;
            next();
        } catch (error) {
            // console.log("-> [Сокет] Ошибка JWT:", error.message);
            return next(new customError('Invalid token', 500))
        }

    }) 
    io.on('connection', (socket) => {

        // console.log("=== НОВЫЙ СОКЕТ ПОДКЛЮЧИЛСЯ ===");
        // console.log("Расшифрованный токен (socket.user):", socket.user);

        // Достаем ID (пробуем оба варианта, в зависимости от структуры токена)
        const userId = socket.user?.id || socket.user?.user?.id;
if (userId) {
            socket.join(userId.toString());
            // console.log("✅ Клиент успешно добавлен в комнату:", userId.toString());
        } else {
            console.log("❌ ОШИБКА: Не смогли найти ID юзера в токене!");
        }
    });

    return io;
};

export const getIO = () =>{
    //space for initialization ErrorHandler

    return io;
} 