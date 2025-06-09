'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { chatWithVira, getVendors } from '@/services/firebase';
import type { Vendor } from '@/types';

const chatSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type ChatInput = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// [R10] Implements the ViRA Chat interface.
export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [vendorDataContext, setVendorDataContext] = React.useState<string>('');
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<ChatInput>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  // [R10.3] Fetches all vendor data to provide as context to the chat agent.
  React.useEffect(() => {
    const fetchVendorContext = async () => {
        try {
            const vendors = await getVendors();
            const context = JSON.stringify(vendors.map(v => ({
                name: v.name,
                location: v.location,
                rating: v.rating,
                reviewCount: v.reviewCount,
                services: v.services,
                notes: v.notes
            })));
            setVendorDataContext(context);
        } catch (error) {
            toast({ title: "Error", description: "Could not load vendor context for chat.", variant: "destructive" });
        }
    };
    fetchVendorContext();
  }, [toast]);

  // [R10.2] Handles form submission and calls the chat service function.
  const onSubmit: SubmitHandler<ChatInput> = async (data) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: data.message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    setIsLoading(true);

    try {
      const aiResponse = await chatWithVira({
        vendorData: vendorDataContext,
        question: data.message,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.answer,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "ViRA is currently unavailable. Please try again later.",
        variant: "destructive",
      });
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request right now.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Auto-scroll logic
    if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl flex flex-col h-[70vh]">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-2xl flex items-center">
          <Bot className="mr-2 h-7 w-7 text-primary" /> ViRA Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback></Avatar>
                )}
                <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.sender === 'user' && (
                   <Avatar className="h-8 w-8"><AvatarFallback className="bg-accent text-accent-foreground"><User size={18}/></AvatarFallback></Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback></Avatar>
                <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md bg-secondary text-secondary-foreground rounded-bl-none">
                  <div className="flex space-x-1 animate-pulse">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
          <Input {...form.register('message')} placeholder="Ask ViRA about vendors..." className="flex-grow" autoComplete="off" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={isLoading || !vendorDataContext} className="bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
