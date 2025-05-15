import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi 👋 I'm your Thryve AI Chatbot. Ask me anything about credit repair! 💳",
    },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "No response from server." },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error contacting server. Please try again." },
      ]);
    }
    setLoading(false);
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
              width: "350px",
              maxHeight: "500px",
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
            <div
              style={{
                flex: 1,
                padding: "10px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: m.role === "user" ? "#e6f7ff" : "#edfff2",
                      color: "#222",
                      padding: "10px 16px",
                      borderRadius: m.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      margin: "6px 0",
                      maxWidth: "80%",
                      minWidth: "60px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <strong>
                      {m.role === "user" ? "You" : "Thryve"}:
                    </strong>{" "}
                    <span>
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </span>
                  </div>
                </div>
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
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderTopRightRadius: "12px",
                  borderBottomRightRadius: "12px",
                }}
              >
                {loading ? "..." : "Send"}
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
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
          >
            💬 Thryve Chatbot
          </button>
        )}
      </div>
    </div>
  );
}
