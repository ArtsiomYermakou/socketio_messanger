import io from "socket.io-client";

export const api = {
    socket: null as null | SocketIOClient.Socket,
    createConnection() {
        this.socket = io("https://samurai-chat-back.herokuapp.com");
    },
    subscribe(initMessagesHandler: (messages: any) => void,
              newMessageSentHandler: (message: any) => void) {
        this.socket?.on("init-message-published", initMessagesHandler)
        this.socket?.on("new-message-sent", newMessageSentHandler)
    },
    destroyConnection() {
        this.socket?.disconnect();
        this.socket = null;
    }
}
