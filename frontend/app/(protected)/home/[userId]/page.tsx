import React from 'react';

//@ts-ignore
import { Input } from "@/components/ui/input";
//@ts-ignore
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { ChatClient } from '../../../../components/chat/chat-client';

const ChatPage = async () => {
    return (
        <div className='w-full h-full'>
            <ChatClient/>
        </div>
    )
}
export default ChatPage;