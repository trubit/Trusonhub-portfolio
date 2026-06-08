import { apiClient } from "./client";

export const getTestimonialsRequest = async () => {
  const { data } = await apiClient.get("/testimonials");
  return data;
};

export const createTestimonialRequest = async (payload) => {
  const { data } = await apiClient.post("/testimonials", payload);
  return data;
};

export const updateTestimonialRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/testimonials/${id}`, payload);
  return data;
};

export const deleteTestimonialRequest = async (id) => {
  await apiClient.delete(`/testimonials/${id}`);
};
