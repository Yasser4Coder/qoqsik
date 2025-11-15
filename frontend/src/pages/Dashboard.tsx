import { useState, useEffect } from "react";
import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import { ChatInput } from "../components/ChatInput.tsx";
import { getAuthUser, type ChatMessageResponse } from "../lib/api.ts";

const examplePrompts = [
  "Give me the employee who had the most warnings in the last quarter.",
  "Hello, Qoqsik.",
  "Summarize all of the reports in the IT department.",
];

export function DashboardPage() {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const user = getAuthUser();

  const handleMessageSent = async (userMessage: string, assistantResponse: ChatMessageResponse) => {
    // Add user message and assistant response to the conversation
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-user-${Date.now()}`,
        content: userMessage,
        role: "user",
        user_id: user?.id || null,
        conversation_id: null,
        created_at: new Date().toISOString(),
      },
      assistantResponse,
    ]);
    setSelectedPrompt("");
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <DashboardShell>
      <section className="flex h-full flex-1 flex-col overflow-hidden rounded-[32px] bg-[#f3f3f3]  px-6 pt-6">
        <div className="flex flex-1 flex-col overflow-hidden bg-[#f3f3f3]">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <img
                  src="/logo1.png"
                  alt="Logo"
                  className="mb-6 w-24 object-contain"
                />
                <h2 className="mb-8 text-2xl font-semibold text-indigo">
                  Welcome, {user?.full_name || "User"}
                </h2>
                <div className="w-full max-w-2xl space-y-3">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full rounded-2xl border border-indigo/20 bg-white/80 px-6 py-4 text-left text-sm text-indigo transition hover:border-indigo/40 hover:bg-white hover:shadow-md"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-indigo text-white"
                          : "bg-white text-indigo shadow-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                      <p className="text-sm text-slate/70">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <ChatInput
            onMessageSent={handleMessageSent}
            initialMessage={selectedPrompt}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </section>
    </DashboardShell>
  );
}
