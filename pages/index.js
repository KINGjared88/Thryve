import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi 窓 I'm your Thryve AI Chatbot. Ask me anything about credit repair! 諜",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Added for submit prevention

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
                    }
                ]);
            } else {
                const data = await response.json();
                setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.reply }]);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    role: 'error',
                    content: "Error contacting server. Please try again.",
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            sendMessage();
        }
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [collectingInfo, setCollectingInfo] = useState(false);
    const [infoCollected, setInfoCollected] = useState(false);

    const handleInfoSubmit = async () => {
        if (!name || !email || !phone) {
            alert('Please provide your name, email, and phone.');
            return;
        }
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        setMessages(prev => [
            ...prev,
            {
                role: 'assistant',
                content: `Thank you, ${name}! We'll email your copy of "The Easy and Fast Way to Delete Hard Inquiries" to ${email}, and text you the download link.`,
            }
        ]);
        setCollectingInfo(false);
        setInfoCollected(true);

        try {
            const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/22909312/27596qv/';
            const response = await fetch(zapierWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone }),
            });

            if (!response.ok) {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: "There was an issue processing your request. Please try again later.",
                    }
                ]);
            } else {
                console.log('Data sent to Zapier successfully!');
            }
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "There was a connection error. Please try again.",
                }
            ]);
        }
        setIsSubmitting(false); // Reset after submission
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {!open ? (
                <button onClick={toggleChat} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
                    💬 Thryve Chatbot
                </button>
            ) : (
                <div style={{ width: '350px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f0f0f0', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#333', fontSize: '16px' }}>Thryve AI Chat</strong>
                        <button onClick={toggleChat} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '18px', cursor: 'pointer', color: '#666' }}>×</button>
                    </div>
                    <div style={{ height: '400px', overflowY: 'auto', padding: '12px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: '12px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                <strong>{msg.role === 'user' ? 'You:' : 'Thryve AI:'}</strong>
                                <ReactMarkdown children={msg.content} />
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                    {collectingInfo && !infoCollected ? (
                        <div style={{ padding: '12px', borderTop: '1px solid #eee' }}>
                            <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <input placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <input placeholder="Your Phone" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <button onClick={handleInfoSubmit} style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex' }}>
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    marginLeft: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                {loading ? "..." : "Send"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
