import express from 'express';
import cors from 'cors'
import { create_session, driver } from './database.js';
import { redis_client, connection } from "./database.js";
import WebSocket, { WebSocketServer } from 'ws'
// import { create_server } from './socket.cjs';
// const create_server = required('./socket.js')

// Routes import:
import userRoute from './Routes/user.js'
import storeRoute from './Routes/store.js'
import brandRoute from './Routes/brand.js'
import typeRoute from './Routes/type.js'
import productRoute from './Routes/product.js'
import locationRoute from './Routes/location.js'

// Express config:
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express router:
app.use('/user/', userRoute);
app.use('/store/', storeRoute);
app.use('/brand/', brandRoute);
app.use('/type/', typeRoute);
app.use('/product/', productRoute);
app.use('/location/', locationRoute);

// Database connection instance:
const handler = async () => {
    
    const serverCustomer = new WebSocketServer({ port: 3400 });
    const redisCustomer = connection.duplicate()
    redisCustomer.connect();

    // On connect -> accept socket and set user.id and user.intrested_in_products
    serverCustomer.on("connection", async (ws) => {
        ws.on("message", async (data) => {

            let response = JSON.parse(data);
            console.log('User send object: ', response)
            console.log(`User with id: ${response.id} subscribed to events: [${response.tag}]`)
            ws.id = response.id;
            ws.tag = response.tag;
            console.log('Socket object tag list after creating: ', ws.tag)
        });
    });

    redisCustomer.SUBSCRIBE("app:customer", (message) => {
        let msg = JSON.parse(message);
        serverCustomer.clients.forEach(client => {
            sendMessage(msg, client);
        });
    });

    const sendMessage = (message, client) => {
        message.tag.forEach(tag => {
            if(client.tag.includes(tag)) {
                client.send(JSON.stringify(message))
            }
        })
    };

    app.listen(8000, () => {
        console.log("Express server started at: 8000")
    })

};

// Create connection and start Express server:
handler()