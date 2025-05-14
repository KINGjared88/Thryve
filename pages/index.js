
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I'm your Thryve AI Chatbot. Ask me anything about credit repair! 💳" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Oops! Something went wrong on the server." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          fontFamily: "sans-serif",
        }}
      >
        {open ? (
          <div
            style={{
              width: "90vw",
              maxWidth: "350px",
              height: "500px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              Thryve AI Chatbot
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "8px",
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
            <div style={{ flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: m.role === "user" ? "#e6f7ff" : "#f0fff4",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    margin: "6px 0",
                    maxWidth: "85%",
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{ __html: marked.parse(`${m.role === "user" ? "**You**" : "**Thryve**"}: ${m.content}`) }}
                />
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1, padding: "10px", border: "none" }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💬 Thryve Chatbot
          </button>
        )}
      </div>
    </div>
  );
}
