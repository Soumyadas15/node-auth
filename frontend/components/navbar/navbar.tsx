"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "@/actions/logout.action";
import { useTransition } from "react";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { UserMenu } from "@/components/navbar/user-menu";
import { ThemeToggle } from "../theme-toggle";
import { useModal } from "@/hooks/use-modal-store";

interface NavbarProps{
    user: any;
}
export const Navbar = ({
    user,
} : NavbarProps) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { onOpen } = useModal();

    return (
        <nav className="
            fixed h-16 w-full 
            px-4 md:px-8 flex
            items-center justify-between
            bg-background
            transition
            duration-300
            border-b
            shadow-sm
        ">
            <h1 
                className="text-xl font-bold text-primary cursor-pointer"
                onClick={() => router.push('/home')}
            >
                Chat App
            </h1>
            <div className="flex items-center gap-4">
                
                <ThemeToggle/>
                {user && (
                    <UserMenu user={user}/>
                )}
            </div>
        </nav>
    )
}