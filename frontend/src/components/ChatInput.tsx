import { type FormEvent, useState } from "react";
import { TbPaperclip, TbMoodSmile, TbSend } from "react-icons/tb";
import { sendChatMessage } from "../lib/api.ts";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      await sendChatMessage({ content: message.trim() });
      setMessage("");
      setStatus("Message sent!");
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-4 shadow-panel">
      <form
        className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="text-slate/70 transition hover:text-indigo"
          aria-label="Attach"
        >
          <TbPaperclip size={20} />
        </button>
        <button
          type="button"
          className="text-slate/70 transition hover:text-indigo"
          aria-label="Insert emoji"
        >
          <TbMoodSmile size={20} />
        </button>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message ..."
          className="flex-1 border-none text-sm text-indigo outline-none placeholder:text-slate/60"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-transparent p-3 text-white shadow-lg disabled:opacity-60"
        >
          <TbSend className="text-black" size={20} />
        </button>
      </form>
      {status && <p className="px-2 pt-2 text-xs text-indigo">{status}</p>}
    </div>
  );
}
