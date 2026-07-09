import { useEffect, useState } from "react";
import messageService from "../../services/message.service";
import "./Messages.css";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    messageService
      .getMessages()
      .then(setMessages)
      .catch((err) => setError(err.response?.data?.message || "Could not load messages."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  if (loading) return <p className="msg-empty">Loading messages...</p>;
  if (error) return <p className="msg-error">{error}</p>;
  if (messages.length === 0) return <p className="msg-empty">No messages yet. Visitor submissions from your contact form will appear here.</p>;

  return (
    <div className="messages-page">
      {messages.map((m) => (
        <div className="msg-card" key={m._id}>
          <div className="msg-card-header" onClick={() => setOpenId(openId === m._id ? null : m._id)}>
            <div>
              <p className="msg-subject">{m.subject}</p>
              <p className="msg-meta">
                {m.name} · {m.email}
              </p>
            </div>
            <span className="msg-date">{formatDate(m.createdAt)}</span>
          </div>
          {openId === m._id && <p className="msg-body">{m.message}</p>}
        </div>
      ))}
    </div>
  );
}
