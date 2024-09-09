import React from "react";
import { ChatHeader } from "./chat-header";

interface ChatListProps{

}

export const ChatList = ({

}: ChatListProps) => {
    return (
        <div className="px-2 md:px-6 py-4 w-full">
            <ChatHeader/>
        </div>
    )
}