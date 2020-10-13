import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import io from "socket.io-client"

const socket = io("https://samurai-chat-back.herokuapp.com");

function App() {

    useEffect(() => {
        socket.on("init-messages-published", (messages: any) => {
            setMessages(messages)
        })
        socket.on("new-message-sent", (message: any) => {
            setMessages((messages) => [...messages, message])
        })
    }, [])

    const [messages, setMessages] = useState<Array<any>>([])

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
                    if (e.currentTarget.scrollTop > lastScrollTop) {
                        setIsAutoScrollActive(true);
                    } else {
                        setIsAutoScrollActive(false);
                    }
                    setLastScrollTop(e.currentTarget.scrollTop);
                }}
                >
                    {messages.map(m => {
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
