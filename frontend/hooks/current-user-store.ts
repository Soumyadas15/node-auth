import { create } from "zustand";
import { cookies } from "next/headers";
//@ts-ignore
import { getCookie } from "@/lib/get-cookie";

interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  
  setUser: (user) => set({ user }),
  fetchCurrentUser: async () => {
    const userToken = await getCookie("currentUserToken");

    if (userToken) {
      const user = JSON.parse(userToken);
      set({ user });
    } else {
      set({ user: null });
    }
  },
}));
