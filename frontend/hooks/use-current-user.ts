import { useEffect } from "react";
import { useUserStore } from "./current-user-store";

export function useCurrentUser() {
  const user = useUserStore((state) => state.user);
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return user;
}
