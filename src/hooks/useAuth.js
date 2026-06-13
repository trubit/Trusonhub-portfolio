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
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data?.user) {
      setUser(meQuery.data.user);
    }
  }, [meQuery.data?.user, setUser]);

  useEffect(() => {
    if (meQuery.isError) {
      const status = meQuery.error?.response?.status;
      if (status === 401 || status === 403) {
        clearAuth();
        queryClient.clear();
      }
    }
  }, [meQuery.isError, meQuery.error, clearAuth, queryClient]);

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
