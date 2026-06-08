import { useEffect, useRef } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Stack, Typography } from "@mui/material";

import { useMediaStore } from "../../../store/mediaStore";

const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.rtf,.txt,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const ResumeSection = () => {
  const resumePdf = useMediaStore((s) => s.media.resumePdf);
  const uploading = useMediaStore((s) => s.uploading);
  const status = useMediaStore((s) => s.status);
  const loaded = useMediaStore((s) => s.loaded);
  const load = useMediaStore((s) => s.load);
  const uploadResume = useMediaStore((s) => s.uploadResume);
  const deleteResume = useMediaStore((s) => s.deleteResume);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  return (
    <>
      <div className="section-page-header">
        <h2>Resume Management</h2>
        <p>Upload, preview, and manage your public resume file.</p>
      </div>

      {status && (
        <div className={`cms-status-strip ${status.toLowerCase().includes("fail") || status.toLowerCase().includes("error") ? "error" : "success"}`}>
          {status}
        </div>
      )}

      <div className="cms-card">
        <div className="cms-card-title">Current Resume</div>

        <div className="doc-card">
          <div className="doc-card-info">
            <div className="doc-card-title">Resume File</div>
            <div className="doc-card-status">
              {resumePdf ? "Resume is uploaded and ready." : "No resume uploaded yet."}
            </div>
          </div>
          <div className="doc-card-actions">
            {resumePdf && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                href={resumePdf}
                target="_blank"
                rel="noreferrer"
                component="a"
              >
                Preview
              </Button>
            )}
            <input
              ref={inputRef}
              aria-hidden="true"
              hidden
              type="file"
              accept={DOCUMENT_ACCEPT}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) uploadResume(f);
              }}
            />
            <Button
              size="small"
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => inputRef.current?.click()}
              disabled={uploading.resume}
            >
              {uploading.resume ? "Uploading…" : resumePdf ? "Replace Resume" : "Upload Resume"}
            </Button>
            {resumePdf && (
              <Button size="small" color="error" variant="outlined" onClick={deleteResume} disabled={uploading.resume}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {resumePdf && (
        <div className="cms-card">
          <div className="cms-card-title">Resume Preview</div>
          <iframe
            src={resumePdf}
            title="Resume preview"
            style={{ width: "100%", height: 600, borderRadius: 10, border: "1px solid #e2e8f0" }}
          />
        </div>
      )}

      {!resumePdf && (
        <div className="cms-card">
          <Typography color="text.secondary" fontSize="0.875rem">
            Upload a resume file to preview it here. Supported formats: PDF, DOC, DOCX.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            sx={{ mt: 2 }}
            onClick={() => inputRef.current?.click()}
            disabled={uploading.resume}
          >
            {uploading.resume ? "Uploading…" : "Upload Resume"}
          </Button>
        </div>
      )}
    </>
  );
};
