
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi 👋 I'm your Thryve AI Chatbot. Ask me anything about credit repair! 💳",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    const toggleChat = () => setOpen(!open);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        role: 'error',
                        content: "Sorry, I encountered an error while processing your request. Please try again later.",
                    },
                ]);
            } else {
                const data = await response.json();
                setMessages(prevMessages => [
                    ...prevMessages,
                    { role: 'assistant', content: data.reply }
                ]);
            }
        } catch (error) {
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    role: 'error',
                    content: "Sorry, I couldn't connect to the server. Please check your internet connection and try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !loading && input.trim()) {
            sendMessage();
        }
    };

    // Responsiveness for mobile screens
    const widgetWidth = typeof window !== "undefined" && window.innerWidth < 400 ? "98vw" : "340px";
    const widgetHeight = typeof window !== "undefined" && window.innerWidth < 400 ? "75vh" : "520px";

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                fontFamily: 'sans-serif',
            }}
        >
            {!open && (
                <button
                    onClick={toggleChat}
                    style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    }}
                >
                    💬 Thryve Chatbot
                </button>
            )}
            {open && (
                <div
                    style={{
                        width: widgetWidth,
                        maxWidth: "98vw",
                        height: widgetHeight,
                        maxHeight: "80vh",
                        borderRadius: "14px",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.16)",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "14px",
                            backgroundColor: "#f5f5f5",
                            fontWeight: "bold",
                            fontSize: "17px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        Thryve AI Chatbot
                        <button
                            onClick={toggleChat}
                            style={{
                                position: "absolute",
                                right: "14px",
                                top: "10px",
                                background: "none",
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                                color: "#888",
                            }}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", background: "#fafdff" }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '10px',
                                    padding: '10px 14px',
                                    borderRadius:
                                        msg.role === 'user'
                                            ? '16px 16px 4px 16px'
                                            : msg.role === 'assistant'
                                            ? '16px 16px 16px 4px'
                                            : "16px",
                                    backgroundColor:
                                        msg.role === 'user'
                                            ? '#e6f7ff'
                                            : msg.role === 'assistant'
                                            ? '#edfff2'
                                            : '#ffc9c9',
                                    color: 'black',
                                    alignSelf:
                                        msg.role === 'user'
                                            ? 'flex-end'
                                            : 'flex-start',
                                    maxWidth: '85%',
                                    wordBreak: 'break-word',
                                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                                    border:
                                        msg.role === "error"
                                            ? "1px solid #ff6666"
                                            : "none",
                                }}
                            >
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        ))}
                        {loading && (
                            <div
                                style={{
                                    background: "#f4f4f4",
                                    color: "#888",
                                    padding: "10px 14px",
                                    borderRadius: "16px 16px 16px 4px",
                                    fontStyle: "italic",
                                    alignSelf: "flex-start",
                                    maxWidth: "60%",
                                    marginBottom: "10px",
                                    fontSize: "15px",
                                }}
                            >
                                Thryve is typing…
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                    <div style={{ display: "flex", borderTop: "1px solid #eee", padding: "10px", background: "#f9fafb" }}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #eee" }}
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                padding: "10px 18px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                marginLeft: "8px",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
