import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProjectRequest,
  deleteProjectRequest,
  getMyProjectsRequest,
  getPublicProjectsRequest,
} from "../api/projectApi";
import { useAuthStore } from "../store/authStore";

export const usePublicProjects = () =>
  useQuery({
    queryKey: ["public-projects"],
    queryFn: getPublicProjectsRequest,
    staleTime: 60_000,
  });

export const useMyProjects = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjectsRequest,
    enabled: Boolean(token),
  });

  const createProject = useMutation({
    mutationFn: createProjectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: deleteProjectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
    },
  });

  return {
    projectsQuery,
    createProject,
    deleteProject,
  };
};

