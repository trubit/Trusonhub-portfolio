import { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMeRequest } from "../../../api/authApi";
import { uploadAvatarRequest } from "../../../api/uploadApi";
import { useAuth } from "../../../hooks/useAuth";
import { useMyProfile } from "../../../hooks/useProfile";
import { useMediaStore } from "../../../store/mediaStore";

const parseList = (input = "") =>
  input.split(",").map((s) => s.trim()).filter(Boolean);

const toCsv = (value) =>
  Array.isArray(value) ? value.join(", ") : value || "";

export const ProfileSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { profileQuery, updateProfile } = useMyProfile();

  const profilePhoto = useMediaStore((s) => s.media.profilePhoto);
  const coverImage = useMediaStore((s) => s.media.coverImage);
  const uploading = useMediaStore((s) => s.uploading);
  const mediaLoaded = useMediaStore((s) => s.loaded);
  const loadMedia = useMediaStore((s) => s.load);
  const uploadProfilePhoto = useMediaStore((s) => s.uploadProfilePhoto);
  const deleteProfilePhoto = useMediaStore((s) => s.deleteProfilePhoto);
  const uploadCoverImage = useMediaStore((s) => s.uploadCoverImage);
  const deleteCoverImage = useMediaStore((s) => s.deleteCoverImage);
  const mediaStatus = useMediaStore((s) => s.status);

  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [status, setStatus] = useState("");
  const [identityForm, setIdentityForm] = useState({ fullName: "", headline: "", location: "", bio: "" });
  const [editableProfile, setEditableProfile] = useState(null);

  useEffect(() => {
    if (!mediaLoaded) loadMedia();
  }, [mediaLoaded, loadMedia]);

  useEffect(() => {
    if (user) {
      setIdentityForm({
        fullName: user.fullName || "",
        headline: user.headline || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const profileForm = useMemo(() => {
    const d = profileQuery.data;
    return {
      brandStatement: d?.brandStatement || "",
      availability: d?.availability || "open",
      timezone: d?.timezone || "Africa/Lagos",
      yearsOfExperience: d?.yearsOfExperience || 0,
      desiredRoles: toCsv(d?.desiredRoles),
      jobSearchStatus: d?.jobSearchStatus || "actively-looking",
      preferredWorkModes: toCsv(d?.preferredWorkModes),
      targetRegions: toCsv(d?.targetRegions),
      requiresVisaSponsorship: Boolean(d?.requiresVisaSponsorship),
      willingToRelocate: typeof d?.willingToRelocate === "boolean" ? d.willingToRelocate : true,
      languages: toCsv(d?.languages),
      skills: toCsv(d?.skills),
      services: toCsv(d?.services),
      linkedin: d?.socialLinks?.linkedin || "",
      github: d?.socialLinks?.github || "",
      x: d?.socialLinks?.x || "",
      website: d?.socialLinks?.website || "",
    };
  }, [profileQuery.data]);

  const active = editableProfile || profileForm;

  const onProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...(prev || profileForm), [name]: value }));
  };

  const updateIdentity = useMutation({
    mutationFn: updateMeRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  const saveIdentity = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await updateIdentity.mutateAsync(identityForm);
      setStatus("Identity saved successfully.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save identity.");
    }
  };

  const saveCareerProfile = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await updateProfile.mutateAsync({
        brandStatement: active.brandStatement,
        availability: active.availability,
        timezone: active.timezone,
        yearsOfExperience: Number(active.yearsOfExperience || 0),
        desiredRoles: parseList(active.desiredRoles),
        jobSearchStatus: active.jobSearchStatus,
        preferredWorkModes: parseList(active.preferredWorkModes),
        targetRegions: parseList(active.targetRegions),
        requiresVisaSponsorship: Boolean(active.requiresVisaSponsorship),
        willingToRelocate: Boolean(active.willingToRelocate),
        languages: parseList(active.languages),
        skills: parseList(active.skills),
        services: parseList(active.services),
        socialLinks: {
          linkedin: active.linkedin,
          github: active.github,
          x: active.x,
          website: active.website,
        },
      });
      setStatus("Career profile saved successfully.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save profile.");
    }
  };

  const displayStatus = status || mediaStatus;

  return (
    <>
      <div className="section-page-header">
        <h2>Profile Management</h2>
        <p>Manage your public-facing identity, career profile, photos, and social links.</p>
      </div>

      {displayStatus && (
        <div className={`cms-status-strip ${displayStatus.toLowerCase().includes("fail") || displayStatus.toLowerCase().includes("error") ? "error" : "success"}`}>
          {displayStatus}
        </div>
      )}

      {/* Photos */}
      <div className="cms-card">
        <div className="cms-card-title">Profile Photo &amp; Cover Image</div>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
          <div>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Profile Photo</Typography>
            <div
              className="photo-upload-zone"
              onClick={() => photoInputRef.current?.click()}
              role="button"
              aria-label="Upload profile photo"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" />
              ) : (
                <div className="photo-placeholder">Click to upload photo</div>
              )}
            </div>
            <input
              ref={photoInputRef}
              aria-hidden="true"
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) uploadProfilePhoto(f);
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button size="small" variant="outlined" onClick={() => photoInputRef.current?.click()} disabled={uploading.profilePhoto}>
                {uploading.profilePhoto ? "Uploading…" : "Change"}
              </Button>
              {profilePhoto && (
                <Button size="small" color="error" variant="outlined" onClick={deleteProfilePhoto} disabled={uploading.profilePhoto}>
                  Remove
                </Button>
              )}
            </Stack>
          </div>

          <div style={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Cover Image</Typography>
            <div
              className="cover-upload-zone"
              onClick={() => coverInputRef.current?.click()}
              role="button"
              aria-label="Upload cover image"
            >
              {coverImage ? (
                <img src={coverImage} alt="Cover" />
              ) : (
                <Typography variant="body2" color="text.secondary">Click to upload cover image</Typography>
              )}
            </div>
            <input
              ref={coverInputRef}
              aria-hidden="true"
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) uploadCoverImage(f);
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button size="small" variant="outlined" onClick={() => coverInputRef.current?.click()} disabled={uploading.coverImage}>
                {uploading.coverImage ? "Uploading…" : "Change Cover"}
              </Button>
              {coverImage && (
                <Button size="small" color="error" variant="outlined" onClick={deleteCoverImage} disabled={uploading.coverImage}>
                  Remove
                </Button>
              )}
            </Stack>
          </div>
        </Stack>
      </div>

      {/* Identity */}
      <div className="cms-card">
        <div className="cms-card-title">Identity &amp; Bio</div>
        <Stack component="form" spacing={2} onSubmit={saveIdentity}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Full Name"
              value={identityForm.fullName}
              onChange={(e) => setIdentityForm((p) => ({ ...p, fullName: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Professional Headline"
              value={identityForm.headline}
              onChange={(e) => setIdentityForm((p) => ({ ...p, headline: e.target.value }))}
            />
          </Stack>
          <TextField
            label="Location"
            value={identityForm.location}
            onChange={(e) => setIdentityForm((p) => ({ ...p, location: e.target.value }))}
          />
          <TextField
            label="Bio / Summary"
            multiline
            minRows={3}
            value={identityForm.bio}
            onChange={(e) => setIdentityForm((p) => ({ ...p, bio: e.target.value }))}
          />
          <Button variant="contained" type="submit" disabled={updateIdentity.isPending} sx={{ alignSelf: "flex-start" }}>
            {updateIdentity.isPending ? "Saving…" : "Save Identity"}
          </Button>
        </Stack>
      </div>

      {/* Career Profile */}
      <div className="cms-card">
        <div className="cms-card-title">Career Profile &amp; Skills</div>
        <Stack component="form" spacing={2} onSubmit={saveCareerProfile}>
          <TextField
            label="Brand Statement"
            name="brandStatement"
            value={active.brandStatement}
            onChange={onProfileChange}
            multiline
            minRows={2}
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Availability" name="availability" value={active.availability} onChange={onProfileChange} />
            <TextField label="Timezone" name="timezone" value={active.timezone} onChange={onProfileChange} />
            <TextField label="Years of Experience" name="yearsOfExperience" type="number" value={active.yearsOfExperience} onChange={onProfileChange} />
          </Stack>
          <TextField label="Job Search Status" name="jobSearchStatus" value={active.jobSearchStatus} onChange={onProfileChange} />
          <TextField label="Desired Roles (comma-separated)" name="desiredRoles" value={active.desiredRoles} onChange={onProfileChange} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField fullWidth label="Preferred Work Modes (comma-separated)" name="preferredWorkModes" value={active.preferredWorkModes} onChange={onProfileChange} />
            <TextField fullWidth label="Target Regions (comma-separated)" name="targetRegions" value={active.targetRegions} onChange={onProfileChange} />
          </Stack>
          <TextField label="Languages (comma-separated)" name="languages" value={active.languages} onChange={onProfileChange} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(active.requiresVisaSponsorship)}
                  onChange={(e) => setEditableProfile((p) => ({ ...(p || profileForm), requiresVisaSponsorship: e.target.checked }))}
                />
              }
              label="Requires visa sponsorship"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(active.willingToRelocate)}
                  onChange={(e) => setEditableProfile((p) => ({ ...(p || profileForm), willingToRelocate: e.target.checked }))}
                />
              }
              label="Willing to relocate"
            />
          </Stack>
          <TextField label="Skills (comma-separated)" name="skills" value={active.skills} onChange={onProfileChange} multiline minRows={2} />
          <TextField label="Services Offered (comma-separated)" name="services" value={active.services} onChange={onProfileChange} multiline minRows={2} />

          <div className="cms-card-title" style={{ marginTop: 4 }}>Social Links</div>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField fullWidth label="LinkedIn URL" name="linkedin" value={active.linkedin} onChange={onProfileChange} />
            <TextField fullWidth label="GitHub URL" name="github" value={active.github} onChange={onProfileChange} />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField fullWidth label="X (Twitter) URL" name="x" value={active.x} onChange={onProfileChange} />
            <TextField fullWidth label="Website URL" name="website" value={active.website} onChange={onProfileChange} />
          </Stack>

          <Button variant="contained" type="submit" disabled={updateProfile.isPending} sx={{ alignSelf: "flex-start" }}>
            {updateProfile.isPending ? "Saving…" : "Save Career Profile"}
          </Button>
        </Stack>
      </div>
    </>
  );
};
