import { useCallback, useEffect, useRef, useState } from "react";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopIcon from "@mui/icons-material/Stop";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const formatTime = (secs) => {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const pickMimeType = () => {
  const candidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp9", "video/webm", "video/mp4"];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
};

export const RecordDemoModal = ({ open, onClose, onUploaded }) => {
  const [source, setSource] = useState("screen");
  const [phase, setPhase] = useState("idle");
  const [duration, setDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const liveRef  = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const blobRef  = useRef(null);
  const timerRef = useRef(null);

  /* ── cleanup helpers ─────────────────────────────────────── */
  const stopStream = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (liveRef.current) liveRef.current.srcObject = null;
  }, []);

  const resetAll = useCallback(() => {
    stopStream();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    chunksRef.current = [];
    setPhase("idle");
    setDuration(0);
    setError("");
  }, [stopStream, previewUrl]);

  useEffect(() => {
    if (!open) resetAll();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── request media ───────────────────────────────────────── */
  const requestStream = async () => {
    setError("");
    setPhase("requesting");
    try {
      const stream =
        source === "screen"
          ? await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true })
          : await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      streamRef.current = stream;
      if (liveRef.current) {
        liveRef.current.srcObject = stream;
        liveRef.current.play().catch(() => {});
      }

      stream.getVideoTracks()[0].addEventListener("ended", () => stopRecording(), { once: true });

      beginRecording(stream);
    } catch (err) {
      const msg =
        err.name === "NotAllowedError"
          ? "Permission denied — please allow screen / camera access and try again."
          : err.name === "NotFoundError"
          ? "No camera / screen source found."
          : `Could not start: ${err.message}`;
      setError(msg);
      setPhase("idle");
    }
  };

  /* ── recording lifecycle ─────────────────────────────────── */
  const beginRecording = (stream) => {
    chunksRef.current = [];
    blobRef.current = null;
    setDuration(0);

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || "video/webm" });
      blobRef.current = blob;
      setPreviewUrl(URL.createObjectURL(blob));
      setPhase("stopped");
      stopStream();
    };

    recorder.start(500);
    setPhase("recording");

    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const pauseRecording = () => {
    recorderRef.current?.pause();
    clearInterval(timerRef.current);
    setPhase("paused");
  };

  const resumeRecording = () => {
    recorderRef.current?.resume();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    setPhase("recording");
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  /* ── upload ──────────────────────────────────────────────── */
  const handleUpload = async () => {
    if (!blobRef.current) return;
    setUploading(true);
    setError("");
    try {
      const ext   = (blobRef.current.type.includes("mp4")) ? "mp4" : "webm";
      const file  = new File(
        [blobRef.current],
        `demo-recording-${Date.now()}.${ext}`,
        { type: blobRef.current.type },
      );
      await onUploaded(file);
      handleClose();
    } catch {
      setError("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  /* ── derived flags ───────────────────────────────────────── */
  const isRecording = phase === "recording";
  const isPaused    = phase === "paused";
  const isStopped   = phase === "stopped";
  const isLive      = isRecording || isPaused;

  /* ── render ─────────────────────────────────────────────── */
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Record Demo Video</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>

          {/* Source selector — only shown when idle */}
          {phase === "idle" && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Choose recording source
              </Typography>
              <ToggleButtonGroup
                value={source}
                exclusive
                onChange={(_, v) => v && setSource(v)}
                size="small"
              >
                <ToggleButton value="screen" sx={{ gap: 0.5 }}>
                  <ScreenShareIcon fontSize="small" /> Screen
                </ToggleButton>
                <ToggleButton value="camera" sx={{ gap: 0.5 }}>
                  <VideocamIcon fontSize="small" /> Camera
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Live preview */}
          {isLive && (
            <Box>
              <video
                ref={liveRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  maxHeight: 260,
                  borderRadius: 8,
                  background: "#000",
                  display: "block",
                  border: isRecording ? "2px solid #ef4444" : "2px solid #f59e0b",
                }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: isRecording ? "error.main" : "warning.main",
                    animation: isRecording ? "pulse 1s infinite" : "none",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                    },
                  }}
                />
                <Typography variant="caption" fontWeight={600}>
                  {isRecording ? "RECORDING" : "PAUSED"} — {formatTime(duration)}
                </Typography>
              </Stack>
            </Box>
          )}

          {/* Recorded preview */}
          {isStopped && previewUrl && (
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Preview — {formatTime(duration)} recorded
              </Typography>
              <video
                src={previewUrl}
                controls
                playsInline
                style={{ width: "100%", maxHeight: 260, borderRadius: 8, background: "#000", display: "block" }}
              />
            </Box>
          )}

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Controls */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
            {phase === "idle" && (
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<FiberManualRecordIcon />}
                onClick={requestStream}
              >
                Start Recording
              </Button>
            )}

            {phase === "requesting" && (
              <Typography variant="body2" color="text.secondary">
                Waiting for permission…
              </Typography>
            )}

            {isRecording && (
              <>
                <Button variant="outlined" startIcon={<PauseIcon />} onClick={pauseRecording}>
                  Pause
                </Button>
                <Button variant="contained" color="error" startIcon={<StopIcon />} onClick={stopRecording}>
                  Stop
                </Button>
              </>
            )}

            {isPaused && (
              <>
                <Button variant="outlined" color="success" startIcon={<PlayArrowIcon />} onClick={resumeRecording}>
                  Resume
                </Button>
                <Button variant="contained" color="error" startIcon={<StopIcon />} onClick={stopRecording}>
                  Stop
                </Button>
              </>
            )}

            {isStopped && (
              <>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload Recording"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={resetAll}
                  disabled={uploading}
                >
                  Discard
                </Button>
              </>
            )}
          </Stack>

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          {isStopped ? "Cancel" : "Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
