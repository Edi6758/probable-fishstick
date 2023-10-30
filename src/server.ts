// server.ts
import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Message from './models/Message'; // Certifique-se de que o caminho está correto para o seu modelo

class App {
    private app: Application;
    private httpServer: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new Server(this.httpServer);

        this.connectToDatabase();
        this.initializeMiddleware();
        this.setupRoutes();
        this.setupSocket();
    }

    connectToDatabase() {
        const dbUri = process.env.MONGO_URL || 'mongodb://mongo:27017/mydatabase';
        mongoose.connect(dbUri)
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.log('MongoDB connection error: ', err));
    }

    initializeMiddleware() {
        this.app.use(bodyParser.json());
    }

    setupRoutes() {
        this.app.post('/data', async (req: Request, res: Response) => {
            try {
                const content = req.body;
                const message = new Message(content);

                await message.save();
                res.status(200).send('Data saved to database');
            } catch (err) {
                console.error('Error saving to database:', err);
                res.status(500).send('Error saving to database');
            }
        });

        this.app.get('/messages', async (req: Request, res: Response) => {
            try {
                const messages = await Message.find();
                res.json(messages);
            } catch (err) {
                console.error('Error getting messages:', err);
                res.status(500).send('Error getting messages from database');
            }
        });
    }

    setupSocket() {
        this.io.on('connection', (socket) => {
            console.log('User connected', socket.id);

            socket.on('message', async (msg) => {
                console.log('Received message:', msg);
                this.io.emit('message', msg);

                // Salvando a mensagem no banco de dados
                const message = new Message({ content: msg });
                try {
                    await message.save();
                } catch (error) {
                    console.error('Error saving message:', error);
                }
            });
        });
    }

    listen() {
        const PORT = process.env.PORT || 3000;
        this.httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

const appInstance = new App();
appInstance.listen();
