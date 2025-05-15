import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 I'm your Thryve AI Chatbot. Ask me anything about credit repair! 💳",
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
  }, [messages, open]);

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
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Sorry, no response." },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Internal server error" },
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
              width: 360,
              height: 530,
              borderRadius: 14,
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "15px",
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                fontSize: "18px",
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
                  right: 14,
                  top: 10,
                  background: "none",
                  border: "none",
                  fontSize: "21px",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ❌
              </button>
            </div>
            <div style={{ flex: 1, padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
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
                      backgroundColor: m.role === "user" ? "#e6f7ff" : "#eaffea",
                      padding: "10px 14px",
                      borderRadius: 15,
                      margin: "6px 0",
                      maxWidth: "75%",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>{m.role === "user" ? "You" : "Thryve"}:</strong>{" "}
                    <ReactMarkdown
                      children={m.content}
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} style={{ color: "#1976d2", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer" />
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #ccc", padding: 12 }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  fontSize: "16px",
                  outline: "none",
                  borderRadius: "8px",
                  background: "#f5f7fa",
                }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 18px",
                  marginLeft: "8px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "7px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
                disabled={loading}
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
              padding: "14px 22px",
              borderRadius: "28px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "17px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            💬 Thryve Chatbot
          </button>
        )}
      </div>
    </div>
  );
}