//@ts-ignore
import { ChatList } from "@/components/chat/chat-list";
import React from "react";
//@ts-ignore
import { SocketProvider } from "@/context/socket.provider";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <SocketProvider>
            <div className="w-full flex h-screen pt-[4rem] transition duration-300">
                <div className="w-[100%] md:w-[40%] lg:w-[30%] h-full flex border-r shadow-sm transition-colors duration-300">
                    <ChatList/>
                </div>
                <div className="w-[0%] md:w-[60%] lg:w-[70%] transition-colors h-full flex duration-300">
                    {children}
                </div>
            </div>
        </SocketProvider>
        
    )
}