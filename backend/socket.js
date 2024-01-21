// const redis_client = require("./database.js");
import { redis_client } from "./database.js";
const WebSocket = require("ws");

const WEB_SOCKET_PORT_CUSTOMER = 3400;
let serverCustomer = new WebSocket.Server({ port: WEB_SOCKET_PORT_CUSTOMER });
var redisCustomer = redis_client.duplicate();
redisCustomer.connect();

const create_server = async () => {
    serverCustomer = new WebSocket.Server({ port: WEB_SOCKET_PORT_CUSTOMER });
}

serverCustomer.on("connection", async function connection(ws) {
    console.log("\n\non message\n\n");
    ws.on("message", async function message(data) {
        console.log("\n\non message\n\n");
        console.log({ data });
        console.log("\n\non message\n\n");

        let response = JSON.parse(data);
        console.log(`\n\n${response}\n\n`);
        console.log(response)
        //if (response.init) {
        ws.id = response.id;
        ws.tag = response.tag;
        // }
    });
});

redisCustomer.SUBSCRIBE("app:customer", message => {
    let msg = JSON.parse(message);
    serverCustomer.clients.forEach(function each(client) {
        sendMessage(msg, client);
    });
});

const sendMessage = (message, client) => {
    //u if provera da li je tag isti
    if (message.tag.includes(client.tag)) client.send(JSON.stringify(message));
};
module.exports = create_server