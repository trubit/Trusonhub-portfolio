import { create } from "zustand";

import { getPublicProfileRequest } from "../api/profileApi";
import { profileData as fallback } from "../content/profileData";

export const useProfileStore = create((set, get) => ({
  user: null,
  profile: null,
  featuredProjects: [],
  loaded: false,
  loading: false,
  error: null,

  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await getPublicProfileRequest();
      set({
        user: data.user || null,
        profile: data.profile || null,
        featuredProjects: data.featuredProjects || [],
        loaded: true,
        loading: false,
      });
    } catch {
      set({ loading: false, loaded: false, error: "Unable to load profile." });
    }
  },

  // Helpers that prefer DB data and fall back to static profileData
  getFullName: () => {
    const { user } = get();
    return user?.fullName || fallback.fullName;
  },

  getHeadline: () => {
    const { user } = get();
    return user?.headline || fallback.headline;
  },

  getLocation: () => {
    const { user } = get();
    return user?.location || fallback.location;
  },

  getBio: () => {
    const { user, profile } = get();
    return profile?.brandStatement || user?.bio || fallback.professionalSummary;
  },

  getSkills: () => {
    const { profile } = get();
    return profile?.skills?.length ? profile.skills : fallback.skills;
  },

  getServices: () => {
    const { profile } = get();
    return profile?.services?.length ? profile.services : fallback.services;
  },

  getSocialLinks: () => {
    const { profile } = get();
    return profile?.socialLinks || { linkedin: fallback.linkedin, github: "", x: "", website: "" };
  },
}));
