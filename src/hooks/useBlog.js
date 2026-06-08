import { useQuery } from "@tanstack/react-query";

import { getPublicBlogPostsRequest } from "../api/blogApi";

export const usePublicBlogPosts = () =>
  useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: getPublicBlogPostsRequest,
  });
