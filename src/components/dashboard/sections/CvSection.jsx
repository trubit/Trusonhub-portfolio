import { useEffect, useRef } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Typography } from "@mui/material";

import { useMediaStore } from "../../../store/mediaStore";

const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.rtf,.txt,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CvSection = () => {
  const cvPdf = useMediaStore((s) => s.media.cvPdf);
  const uploading = useMediaStore((s) => s.uploading);
  const status = useMediaStore((s) => s.status);
  const loaded = useMediaStore((s) => s.loaded);
  const load = useMediaStore((s) => s.load);
  const uploadCv = useMediaStore((s) => s.uploadCv);
  const deleteCv = useMediaStore((s) => s.deleteCv);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  return (
    <>
      <div className="section-page-header">
        <h2>CV Management</h2>
        <p>Upload, preview, and manage your public CV file.</p>
      </div>

      {status && (
        <div className={`cms-status-strip ${status.toLowerCase().includes("fail") || status.toLowerCase().includes("error") ? "error" : "success"}`}>
          {status}
        </div>
      )}

      <div className="cms-card">
        <div className="cms-card-title">Current CV</div>

        <div className="doc-card">
          <div className="doc-card-info">
            <div className="doc-card-title">CV File</div>
            <div className="doc-card-status">
              {cvPdf ? "CV is uploaded and ready." : "No CV uploaded yet."}
            </div>
          </div>
          <div className="doc-card-actions">
            {cvPdf && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                href={cvPdf}
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
                if (f) uploadCv(f);
              }}
            />
            <Button
              size="small"
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => inputRef.current?.click()}
              disabled={uploading.cv}
            >
              {uploading.cv ? "Uploading…" : cvPdf ? "Replace CV" : "Upload CV"}
            </Button>
            {cvPdf && (
              <Button size="small" color="error" variant="outlined" onClick={deleteCv} disabled={uploading.cv}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {cvPdf && (
        <div className="cms-card">
          <div className="cms-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            CV Preview
            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} href={cvPdf} target="_blank" rel="noreferrer" component="a">
              Open in new tab
            </Button>
          </div>
          <iframe
            src={cvPdf}
            title="CV preview"
            style={{ width: "100%", height: 600, borderRadius: 10, border: "1px solid #e2e8f0", marginTop: 8 }}
          />
        </div>
      )}

      {!cvPdf && (
        <div className="cms-card">
          <Typography color="text.secondary" fontSize="0.875rem">
            Upload a CV file to preview it here. Supported formats: PDF, DOC, DOCX.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            sx={{ mt: 2 }}
            onClick={() => inputRef.current?.click()}
            disabled={uploading.cv}
          >
            {uploading.cv ? "Uploading…" : "Upload CV"}
          </Button>
        </div>
      )}
    </>
  );
};
