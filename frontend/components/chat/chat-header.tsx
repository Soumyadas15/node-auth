import React from "react";
//@ts-ignore
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const ChatHeader = () => {
    return (
        <div className="w-full px-2 flex items-center justify-between">
            <h1 className="text-lg font-bold">Chat list</h1>
            <Button variant={'ghost'}>
                <Plus/>
            </Button>
        </div>
    )
}