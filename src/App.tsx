import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {applyMiddleware, combineReducers, createStore} from "redux";
import {useDispatch, useSelector} from "react-redux";
import thunk from "redux-thunk"
import {chatReducer, createConnection, destroyConnection} from "./chat-reducer";
const rootReducer = combineReducers({chat: chatReducer})
type AppStateType = ReturnType<typeof rootReducer>



const store = createStore(combineReducers({chat: chatReducer}),
    applyMiddleware(thunk))

function App() {

    const dispatch = useDispatch()
    const messages = useSelector((state: AppStateType) => state.chat.messages)

    useEffect(() => {
        dispatch(createConnection());
        return () => {
            dispatch(destroyConnection());
        }
    }, [])

    //const [messages, setMessages] = useState<Array<any>>([])

    const [message, setMessage] = useState("Hello")
    const [name, setName] = useState("Artem")
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    const messagesAnchorRef = useRef<HTMLDivElement>(null);

    return (
        <div className="App">
            <div>
                <div style={{
                    border: "1px solid black", padding: "10px", height: "300px", width: "300px", overflow: "scroll"
                }} onScroll={(e) => {
                    let element = e.currentTarget;
                    let maxScrollPosition = element.scrollHeight - element.clientHeight;
                    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
                        setIsAutoScrollActive(true);
                    } else {
                        setIsAutoScrollActive(false);
                    }
                    setLastScrollTop(e.currentTarget.scrollTop);
                }}
                >
                    {messages.map((m: any) => {
                        return <div key={m.id}>
                            <b>{m.user.name}:</b> {m.message}
                            <hr/>
                        </div>
                    })}
                    <div ref={messagesAnchorRef}/>
                </div>
                <div>
                    <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
                    <button onClick={() => {
                        socket.emit("client-name-sent", name)
                    }}>Send Name
                    </button>
                </div>
                <textarea value={message} onChange={e => setMessage(e.currentTarget.value)}>

                </textarea>

                <button onClick={() => {
                    socket.emit("client-message-sent", message)
                    setMessage("")
                }}>Send
                </button>
            </div>
        </div>
    );
}

export default App;
