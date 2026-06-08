import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProjectRequest,
  deleteProjectRequest,
  getMyProjectsRequest,
  updateProjectRequest,
} from "../../../api/projectApi";
import { uploadProjectMediaRequest } from "../../../api/uploadApi";
import { RecordDemoModal } from "./RecordDemoModal";

const parseList = (s = "") => s.split(",").map((x) => x.trim()).filter(Boolean);
const toCsv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

const CATEGORY_SUGGESTIONS = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "API / Integration",
  "E-Commerce",
  "Real-Time Systems",
  "System Architecture",
];

const emptyForm = {
  title: "",
  category: "",
  summary: "",
  fullDescription: "",
  techStack: "",
  repoUrl: "",
  liveUrl: "",
  coverImageUrl: "",
  imageUrls: [],
  videoUrls: [],
  featured: false,
};

export const ProjectSection = () => {
  const queryClient  = useQueryClient();
  const projectsQ    = useQuery({ queryKey: ["my-projects"], queryFn: getMyProjectsRequest });

  const [open,            setOpen]            = useState(false);
  const [editing,         setEditing]         = useState(null);
  const [form,            setForm]            = useState(emptyForm);
  const [uploadingGallery,setUploadingGallery]= useState(false);
  const [uploadingVideo,  setUploadingVideo]  = useState(false);
  const [recordOpen,      setRecordOpen]      = useState(false);
  const [status,          setStatus]          = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        title:           editing.title || "",
        category:        editing.category || "",
        summary:         editing.summary || "",
        fullDescription: editing.fullDescription || "",
        techStack:       toCsv(editing.techStack),
        repoUrl:         editing.repoUrl || "",
        liveUrl:         editing.liveUrl || "",
        coverImageUrl:   editing.coverImageUrl || "",
        imageUrls:       editing.imageUrls || [],
        videoUrls:       editing.videoUrls || [],
        featured:        Boolean(editing.featured),
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  /* ── mutations ───────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: createProjectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
      setOpen(false);
      setStatus("Project created.");
    },
    onError: (err) => setStatus(err.response?.data?.message || "Create failed."),
  });

  const updateMut = useMutation({
    mutationFn: updateProjectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
      setOpen(false);
      setStatus("Project updated.");
    },
    onError: (err) => setStatus(err.response?.data?.message || "Update failed."),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProjectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
      setStatus("Project deleted.");
    },
  });

  /* ── field helpers ───────────────────────────────────────── */
  const onField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  /* ── gallery image upload / reorder / remove ─────────────── */
  const uploadGalleryImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingGallery(true);
    try {
      const res = await uploadProjectMediaRequest(file);
      setForm((p) => ({ ...p, imageUrls: [...p.imageUrls, res.url] }));
    } catch {
      setStatus("Image upload failed.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setForm((p) => ({ ...p, imageUrls: p.imageUrls.filter((_, i) => i !== idx) }));
  };

  const moveGalleryImage = (from, to) => {
    setForm((p) => {
      const arr  = [...p.imageUrls];
      const item = arr.splice(from, 1)[0];
      arr.splice(to, 0, item);
      return { ...p, imageUrls: arr };
    });
  };

  /* ── video upload / remove ───────────────────────────────── */
  const uploadVideo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingVideo(true);
    try {
      const res = await uploadProjectMediaRequest(file);
      setForm((p) => ({ ...p, videoUrls: [...p.videoUrls, res.url] }));
    } catch {
      setStatus("Video upload failed.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeVideo = (idx) => {
    setForm((p) => ({ ...p, videoUrls: p.videoUrls.filter((_, i) => i !== idx) }));
  };

  /* ── recording upload callback ───────────────────────────── */
  const handleRecordingUploaded = async (file) => {
    setUploadingVideo(true);
    try {
      const res = await uploadProjectMediaRequest(file);
      setForm((p) => ({ ...p, videoUrls: [...p.videoUrls, res.url] }));
      setStatus("Recording uploaded.");
    } finally {
      setUploadingVideo(false);
    }
  };

  /* ── save ────────────────────────────────────────────────── */
  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, techStack: parseList(form.techStack) };
    if (editing) {
      await updateMut.mutateAsync({ id: editing._id, payload });
    } else {
      await createMut.mutateAsync(payload);
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  /* ── render ──────────────────────────────────────────────── */
  return (
    <>
      <div className="section-page-header">
        <h2>Project Management</h2>
        <p>Create, edit, and delete portfolio projects.</p>
      </div>

      {status && (
        <div
          className={`cms-status-strip ${
            status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
              ? "error"
              : "success"
          }`}
        >
          {status}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
          Add Project
        </Button>
      </div>

      {projectsQ.isLoading && <Typography color="text.secondary">Loading projects…</Typography>}

      {/* ── Project list ─────────────────────────────────────── */}
      {(projectsQ.data || []).map((project) => (
        <div className="project-cms-card" key={project._id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>

            {/* Project image thumbnail (first image in gallery, or legacy coverImageUrl) */}
            <Box sx={{ flexShrink: 0 }}>
              {((project.imageUrls || [])[0] || project.coverImageUrl) ? (
                <img
                  src={(project.imageUrls || [])[0] || project.coverImageUrl}
                  alt="preview"
                  style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, display: "block", border: "1px solid var(--border)" }}
                />
              ) : (
                <Box sx={{
                  width: 80, height: 60, borderRadius: "6px",
                  border: "1px dashed var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column", gap: 0.25,
                  background: "rgba(10,91,216,0.04)",
                }}>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.6rem", textAlign: "center", lineHeight: 1.2 }}>
                    No image
                  </Typography>
                </Box>
              )}

              {/* Media counts below thumbnail */}
              <Stack direction="row" gap={0.5} sx={{ mt: 0.5, justifyContent: "center" }}>
                <Typography variant="caption" color={(project.imageUrls || []).length > 0 ? "primary" : "text.disabled"} sx={{ fontSize: "0.62rem" }}>
                  🖼 {(project.imageUrls || []).length}
                </Typography>
                <Typography variant="caption" color={(project.videoUrls || []).length > 0 ? "secondary" : "text.disabled"} sx={{ fontSize: "0.62rem" }}>
                  🎬 {(project.videoUrls || []).length}
                </Typography>
              </Stack>
            </Box>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="project-cms-card-title">
                {project.title}
                {project.category && (
                  <span style={{ marginLeft: 8, fontSize: "0.72rem", padding: "2px 8px", borderRadius: 20, background: "rgba(10,91,216,0.1)", color: "var(--primary)", fontWeight: 600 }}>
                    {project.category}
                  </span>
                )}
              </div>
              <div className="project-cms-card-meta">{project.summary}</div>
              <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
                {(project.techStack || []).map((t) => <Chip key={t} label={t} size="small" />)}
                {project.featured && <Chip label="⭐ Featured" size="small" color="primary" />}
              </Stack>
              <Stack direction="row" gap={1}>
                {project.repoUrl && <Button size="small" variant="text" href={project.repoUrl} target="_blank">Repo ↗</Button>}
                {project.liveUrl && <Button size="small" variant="text" href={project.liveUrl} target="_blank">Live ↗</Button>}
              </Stack>
            </div>

            <Stack direction="row" gap={1} flexShrink={0}>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => { setEditing(project); setOpen(true); }}>
                Edit
              </Button>
              <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteMut.mutate(project._id)} disabled={deleteMut.isPending}>
                Delete
              </Button>
            </Stack>
          </div>
        </div>
      ))}

      {!projectsQ.isLoading && (projectsQ.data || []).length === 0 && (
        <Typography color="text.secondary">No projects yet. Click Add Project to get started.</Typography>
      )}

      {/* ── Create / Edit dialog ──────────────────────────────── */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
        <DialogContent>
          <Stack component="form" id="project-form" spacing={2} sx={{ pt: 1 }} onSubmit={save}>

            {/* ── Basic info ── */}
            <TextField label="Project Title" name="title" value={form.title} onChange={onField} required />

            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={onField}
              placeholder="e.g. Full Stack, Frontend, Backend, Mobile…"
              helperText={
                <span>
                  Suggestions:&nbsp;
                  {CATEGORY_SUGGESTIONS.map((c) => (
                    <span
                      key={c}
                      onClick={() => setForm((p) => ({ ...p, category: c }))}
                      style={{ cursor: "pointer", marginRight: 6, color: "var(--primary)", textDecoration: "underline", fontSize: "0.75rem" }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
              }
            />

            <TextField
              label="Short Description"
              name="summary"
              value={form.summary}
              onChange={onField}
              required
              multiline
              minRows={2}
              helperText="Shown on the project card (keep concise)"
            />

            <TextField
              label="Full Description (optional)"
              name="fullDescription"
              value={form.fullDescription}
              onChange={onField}
              multiline
              minRows={4}
              helperText="Detailed write-up shown when visitors click 'View Details'"
            />

            <TextField label="Tech Stack (comma-separated)" name="techStack" value={form.techStack} onChange={onField} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth label="GitHub URL" name="repoUrl" value={form.repoUrl} onChange={onField} />
              <TextField fullWidth label="Live URL" name="liveUrl" value={form.liveUrl} onChange={onField} />
            </Stack>

            <Divider />

            {/* ── Project Images (with reorder) ── */}
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Project Images
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  — the first image is shown as the main preview (use arrows to reorder)
                </Typography>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1,
                  p: form.imageUrls.length === 0 ? 2 : 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  minHeight: 100,
                  alignItems: "center",
                  background: form.imageUrls.length === 0 ? "rgba(10,91,216,0.03)" : "transparent",
                }}
              >
                {form.imageUrls.length === 0 && (
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <Typography variant="caption" color="text.disabled">
                      🖼 No images uploaded yet — click "+ Add" to upload project images
                    </Typography>
                  </Box>
                )}
                {form.imageUrls.map((url, idx) => (
                  <Box
                    key={idx}
                    sx={{ position: "relative", flexShrink: 0 }}
                  >
                    <img
                      src={url}
                      alt={`gallery-${idx}`}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, display: "block" }}
                    />

                    {/* Delete */}
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "white", width: 20, height: 20, "&:hover": { bgcolor: "error.dark" } }}
                      onClick={() => removeGalleryImage(idx)}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>

                    {/* Reorder row */}
                    <Stack
                      direction="row"
                      justifyContent="center"
                      sx={{ mt: 0.25, gap: 0 }}
                    >
                      <Tooltip title="Move left">
                        <span>
                          <IconButton
                            size="small"
                            disabled={idx === 0}
                            onClick={() => moveGalleryImage(idx, idx - 1)}
                            sx={{ p: "2px" }}
                          >
                            <ArrowBackIosNewIcon sx={{ fontSize: 10 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Move right">
                        <span>
                          <IconButton
                            size="small"
                            disabled={idx === form.imageUrls.length - 1}
                            onClick={() => moveGalleryImage(idx, idx + 1)}
                            sx={{ p: "2px" }}
                          >
                            <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Box>
                ))}

                {/* Add image button */}
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  disabled={uploadingGallery}
                  sx={{ width: 80, height: 80, flexDirection: "column", gap: 0.5 }}
                >
                  <AddIcon fontSize="small" />
                  <Typography variant="caption">{uploadingGallery ? "…" : "Add"}</Typography>
                  <input aria-hidden="true" hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadGalleryImage} />
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                JPEG · PNG · WEBP — the first image becomes the main project preview
              </Typography>
            </Box>

            {/* ── Project Videos ── */}
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Project Videos
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  — demos &amp; walkthroughs
                </Typography>
              </Typography>

              {form.videoUrls.length === 0 && (
                <Box sx={{
                  p: 2, mb: 1, border: "1px dashed", borderColor: "divider", borderRadius: 1,
                  textAlign: "center", background: "rgba(10,91,216,0.03)",
                }}>
                  <Typography variant="caption" color="text.disabled">
                    🎬 No videos uploaded yet — upload a file or record a demo live
                  </Typography>
                </Box>
              )}

              <Stack spacing={1} sx={{ mb: 1 }}>
                {form.videoUrls.map((url, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1.5}
                    sx={{ p: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, alignItems: "center" }}
                  >
                    {/* Thumbnail preview */}
                    <video
                      src={url}
                      preload="metadata"
                      muted
                      style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4, flexShrink: 0, background: "#000" }}
                    />
                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" fontWeight={600}>
                        Video {idx + 1}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}
                      >
                        {url.split("/").pop()}
                      </Typography>
                    </Stack>
                    <IconButton size="small" color="error" onClick={() => removeVideo(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>

              {/* Upload + Record buttons */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  disabled={uploadingVideo}
                  startIcon={<VideoFileIcon />}
                >
                  {uploadingVideo ? "Uploading…" : "Upload Video"}
                  <input aria-hidden="true" hidden type="file" accept="video/mp4,video/webm,video/quicktime" onChange={uploadVideo} />
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<FiberManualRecordIcon />}
                  onClick={() => setRecordOpen(true)}
                  disabled={uploadingVideo}
                >
                  Record Demo
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                MP4 · WebM · MOV — max 50 MB · or record your screen/camera live
              </Typography>
            </Box>

            <Divider />

            <FormControlLabel
              control={<Checkbox name="featured" checked={form.featured} onChange={onField} />}
              label="Mark as Featured"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="project-form" variant="contained" disabled={isPending}>
            {isPending ? "Saving…" : editing ? "Save Changes" : "Create Project"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Recording modal ───────────────────────────────────── */}
      <RecordDemoModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        onUploaded={handleRecordingUploaded}
      />
    </>
  );
};
