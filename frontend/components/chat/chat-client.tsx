"use client"

import React, { useState } from "react";
//@ts-ignore
import { Input } from "@/components/ui/input";
//@ts-ignore
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { useSocket } from "../../context/socket.provider";

export const ChatClient = () => {
    const { sendMessage } = useSocket();
    const [message, setMessage] = useState<string>("");
    const [recipientId, setRecipientId] = useState<string>("hhhgh-92hjak-sasjai");

    const handleSendMessage = () => {
        if (message.trim() && recipientId) {
            const fullMessage = `${recipientId}:${message}`;
            sendMessage(fullMessage);
            setMessage(""); 
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className='h-16 w-full border-b shadow-sm'>
                
            </div>
            <div className='h-[10vh] w-full border-t shadow-sm flex justify-between px-4 items-center gap-8'>
                <Input 
                    type="text" 
                    placeholder="Send a message..." 
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={(e : any) => e.key === 'Enter' && handleSendMessage()} // Optional: send message on 'Enter'
                />
                <Button variant={'default'} onClick={handleSendMessage}>
                    <Send />
                </Button>
            </div>
        </div>
    )
}