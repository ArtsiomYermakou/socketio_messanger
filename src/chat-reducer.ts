import {api} from "./api";

const InitialState = {
    messages: []
}

export const chatReducer = (state: any = InitialState, action: any) => {
    switch (action.type) {
        case "messages-received": {
            return {...state, messages: action.messages}
        }
        case "new-messages-received": {
            return {...state, messages: [...state.messages, action.messages]}
        }
        default:
            return state;
    }
}

const messageReceived = (messages: string) => {
    return {type: "messages-received", messages}
}
const newMessageReceived = (message: string) => {
    return {type: "new-messages-received", message}
}

export const createConnection = () => (dispatch: any) => {
    api.createConnection()
    api.subscribe((messages: any) => {
            dispatch(messageReceived(messages))
        },
        (message: any) => {
            dispatch(newMessageReceived(message))
        })
}

export const setClientName = (name: string) => (dispatch: any) => {
    api.sendName(name)
}

export const sendMessage = (messages: string) => (dispatch: any) => {
    api.sendMessage(messages)
}


export const destroyConnection = () => (dispatch: any) => {
    api.destroyConnection()
}

