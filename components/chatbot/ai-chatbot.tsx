"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hello! How may I help you find a service provider today?",
          },
        ],
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error);
    },
    onFinish: (message) => {
      console.log("Chat finished:", message);
    },
  });

  useEffect(() => {
    const checkUserRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: providerData } = await supabase
          .from('providers')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (providerData) {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              parts: [
                {
                  type: "text",
                  text: "Hello! How may I help you with your bookings and schedule today?",
                },
              ],
            },
          ]);
        }
      }
    };

    if (isOpen) {
      checkUserRole();
    }
  }, [setMessages, isOpen]);

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

 const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') 
      .replace(/\*([^*]+)\*/g, '$1');    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now().toString(), role: "user" as const, parts: [{ type: "text", text: input }] };
    setInput("");
    console.log("Sending message:", userMessage);
    try {
      // @ts-ignore
      await sendMessage(userMessage);
    } catch (err) {
      console.error("SendMessage error:", err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 p-0"
        size="icon"
      >
        {isOpen ? <X className="h-10 w-10" /> : <MessageCircle className="h-10 w-10" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] shadow-xl z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              HomeFix Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {stripMarkdown(
                          m.parts
                            ?.filter((part: any) => part.type === "text")
                            .map((part: any) => part.text)
                            .join("")
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                      <p className="text-sm animate-pulse">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about services..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
