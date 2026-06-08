import { useCallback, useEffect, useRef, useState } from "react";

import VideoFileIcon from "@mui/icons-material/VideoFile";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";

import { useMediaStore } from "../../../store/mediaStore";

const getYouTubeEmbedUrl = (input) => {
  try {
    const url = new URL(input.trim());
    let id = "";
    if (url.hostname.includes("youtu.be")) id = url.pathname.slice(1);
    else if (url.hostname.includes("youtube.com"))
      id = url.searchParams.get("v") || url.pathname.split("/").pop() || "";
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
};

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const MediaSection = () => {
  const media = useMediaStore((s) => s.media);
  const uploading = useMediaStore((s) => s.uploading);
  const status = useMediaStore((s) => s.status);
  const loaded = useMediaStore((s) => s.loaded);
  const load = useMediaStore((s) => s.load);
  const galleryImages = useMediaStore((s) => s.media.galleryImages);
  const uploadGalleryImage = useMediaStore((s) => s.uploadGalleryImage);
  const deleteGalleryImage = useMediaStore((s) => s.deleteGalleryImage);
  const uploadInterviewVideo = useMediaStore((s) => s.uploadInterviewVideo);
  const removeInterviewVideo = useMediaStore((s) => s.removeInterviewVideo);
  const addYouTubeInterview = useMediaStore((s) => s.addYouTubeInterview);
  const removeYouTubeInterview = useMediaStore((s) => s.removeYouTubeInterview);
  const setFeaturedInterview = useMediaStore((s) => s.setFeaturedInterview);
  const clearFeaturedInterview = useMediaStore((s) => s.clearFeaturedInterview);

  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [ytInput, setYtInput] = useState("");
  const [ytError, setYtError] = useState("");

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    // Pre-fill title with the filename (without extension) if blank
    if (!videoTitle) {
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && /^video\/(mp4|webm|quicktime)$/i.test(file.type)) handleFileSelect(file);
    },
    [videoTitle], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadInterviewVideo(selectedFile, videoTitle);
    setSelectedFile(null);
    setVideoTitle("");
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleAddYt = () => {
    const embedUrl = getYouTubeEmbedUrl(ytInput);
    if (!embedUrl) {
      setYtError("Invalid YouTube URL");
      return;
    }
    setYtError("");
    addYouTubeInterview(ytInput.trim(), embedUrl);
    setYtInput("");
  };

  const allInterviews = [
    ...media.interviewVideos.map((item) => ({
      id: `v-${item.url}`,
      type: "video",
      url: item.url,
      label: item.title || "Uploaded Video",
    })),
    ...media.youtubeInterviews.map((item) => ({
      id: `yt-${item.url}`,
      type: "youtube",
      url: item.url,
      embedUrl: item.embedUrl,
      label: "YouTube",
    })),
  ];

  return (
    <>
      <div className="section-page-header">
        <h2>Media Management</h2>
        <p>Manage interview videos, YouTube links, and featured interview.</p>
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

      {/* Featured Interview */}
      <div className="cms-card">
        <div className="cms-card-title">Featured Interview</div>
        {media.featuredInterview ? (
          <>
            <div className="media-preview-frame">
              {media.featuredInterview.type === "youtube" ? (
                <iframe
                  src={media.featuredInterview.embedUrl}
                  title="Featured interview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls src={media.featuredInterview.url} />
              )}
            </div>
            <Button variant="outlined" color="error" size="small" onClick={clearFeaturedInterview}>
              Remove Featured
            </Button>
          </>
        ) : (
          <Typography color="text.secondary" fontSize="0.875rem">
            No featured interview set. Upload a video or add a YouTube link below, then click
            Feature.
          </Typography>
        )}
      </div>

      {/* Upload Interview Video */}
      <div className="cms-card">
        <div className="cms-card-title">Upload Interview Video</div>
        <Stack spacing={2}>
          <TextField
            size="small"
            label="Video Title"
            placeholder="e.g. TechTalk Podcast — Episode 3"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            disabled={uploading.video}
          />

          {/* Drop zone */}
          <div
            className={`video-upload-zone${dragOver ? " drag-over" : ""}${selectedFile ? " has-file" : ""}`}
            onClick={() => !uploading.video && videoInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && videoInputRef.current?.click()}
            aria-label="Click or drag a video file to upload"
          >
            {selectedFile ? (
              <div className="video-upload-zone-preview">
                <VideoFileIcon sx={{ fontSize: 36, color: "var(--primary, #0a5bd8)" }} />
                <div className="video-upload-zone-filename">{selectedFile.name}</div>
                <div className="video-upload-zone-size">{formatBytes(selectedFile.size)}</div>
              </div>
            ) : (
              <div className="video-upload-zone-empty">
                <VideoFileIcon sx={{ fontSize: 36, opacity: 0.35 }} />
                <div className="video-upload-zone-hint">
                  {dragOver ? "Drop video here" : "Click or drag video to upload"}
                </div>
                <div className="video-upload-zone-formats">MP4 · WebM · MOV</div>
              </div>
            )}
          </div>

          <input
            ref={videoInputRef}
            aria-hidden="true"
            hidden
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || uploading.video}
              startIcon={uploading.video ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {uploading.video ? "Uploading…" : "Upload Video"}
            </Button>
            {selectedFile && !uploading.video && (
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  setSelectedFile(null);
                  setVideoTitle("");
                  if (videoInputRef.current) videoInputRef.current.value = "";
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Stack>
      </div>

      {/* Photo Gallery */}
      <div className="cms-card">
        <div className="cms-card-title">Professional Photo Gallery</div>
        <input
          ref={galleryInputRef}
          aria-hidden="true"
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = "";
            for (const file of files) {
              await uploadGalleryImage(file);
            }
          }}
        />
        <Button
          variant="outlined"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploading.gallery}
          sx={{ mb: 2 }}
        >
          {uploading.gallery ? "Uploading…" : "Add Photo(s)"}
        </Button>

        {galleryImages.length === 0 ? (
          <Typography color="text.secondary" fontSize="0.875rem">
            No gallery photos yet. Click above to add professional photos.
          </Typography>
        ) : (
          <div className="gallery-admin-grid">
            {galleryImages.map((url, idx) => (
              <div key={`${url}-${idx}`} className="gallery-admin-item">
                <img src={url} alt={`Gallery ${idx + 1}`} />
                <button
                  className="gallery-admin-delete"
                  onClick={() => deleteGalleryImage(url)}
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add YouTube Interview */}
      <div className="cms-card">
        <div className="cms-card-title">Add YouTube Interview Link</div>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <TextField
            fullWidth
            size="small"
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={ytInput}
            onChange={(e) => setYtInput(e.target.value)}
            error={Boolean(ytError)}
            helperText={ytError}
          />
          <Button
            variant="contained"
            onClick={handleAddYt}
            sx={{ flexShrink: 0, mt: { xs: 0, sm: "2px" } }}
          >
            Add Link
          </Button>
        </Stack>
      </div>

      {/* All Interviews */}
      <div className="cms-card">
        <div className="cms-card-title">All Interviews ({allInterviews.length})</div>
        {allInterviews.length === 0 ? (
          <Typography color="text.secondary" fontSize="0.875rem">
            No interviews yet.
          </Typography>
        ) : (
          allInterviews.map((item) => (
            <div className="interview-item" key={item.id}>
              {item.type === "video" && (
                <div className="interview-item-thumb">
                  <video
                    src={item.url}
                    style={{
                      width: 96,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                      background: "#000",
                      flexShrink: 0,
                      display: "block",
                    }}
                    preload="metadata"
                  />
                </div>
              )}
              {item.type === "youtube" && (
                <div
                  className="interview-item-thumb"
                  style={{
                    width: 96,
                    height: 60,
                    borderRadius: 6,
                    background: "#ff0000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.04em",
                  }}
                >
                  YouTube
                </div>
              )}

              <div className="interview-item-info">
                <div className="interview-item-label">{item.label}</div>
                <div className="interview-item-sub">
                  {item.type === "youtube" ? item.url : "Uploaded video"}
                </div>
              </div>

              <div className="interview-item-actions">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setFeaturedInterview(item)}
                  disabled={media.featuredInterview?.url === item.url}
                >
                  {media.featuredInterview?.url === item.url ? "Featured" : "Feature"}
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() =>
                    item.type === "youtube"
                      ? removeYouTubeInterview(item.url)
                      : removeInterviewVideo(item.url)
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
