import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { meRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, user, setUser, clearAuth } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: meRequest,
    enabled: Boolean(token),
    retry: 1,
  });

  useEffect(() => {
    if (meQuery.data?.user) {
      setUser(meQuery.data.user);
    }
  }, [meQuery.data?.user, setUser]);

  return {
    token,
    user: meQuery.data?.user || user,
    profile: meQuery.data?.profile || null,
    isAuthenticated: Boolean(token),
    isLoadingMe: meQuery.isLoading,
    logout: () => {
      clearAuth();
      queryClient.clear();
    },
  };
};
