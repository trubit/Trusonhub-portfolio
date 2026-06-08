import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyProfileRequest,
  getPublicProfileRequest,
  updateMyProfileRequest,
} from "../api/profileApi";
import { useAuthStore } from "../store/authStore";

export const usePublicProfile = () =>
  useQuery({
    queryKey: ["public-profile"],
    queryFn: getPublicProfileRequest,
  });

export const useMyProfile = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfileRequest,
    enabled: Boolean(token),
  });

  const updateProfile = useMutation({
    mutationFn: updateMyProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });

  return { profileQuery, updateProfile };
};

