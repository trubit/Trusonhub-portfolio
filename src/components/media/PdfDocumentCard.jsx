import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export const PdfDocumentCard = ({
  title,
  docUrl,
  uploading,
  uploadIdleLabel,
  uploadLoadingLabel,
  downloadLabel,
  deleteLabel,
  successLabel,
  emptyLabel,
  previewTitle,
  onUpload,
  onDelete,
}) => {
  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    event.target.value = "";
  };

  return (
    <Card variant="outlined" className="resume-card">
      <CardContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} className="mt-2">
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadRoundedIcon />}
            disabled={uploading}
          >
            {uploading ? uploadLoadingLabel : uploadIdleLabel}
            <input aria-hidden="true" hidden type="file" accept="application/pdf" onChange={handleUpload} />
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            href={docUrl || undefined}
            disabled={!docUrl}
            target="_blank"
            rel="noreferrer"
          >
            {downloadLabel}
          </Button>
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            disabled={!docUrl}
            onClick={onDelete}
          >
            {deleteLabel}
          </Button>
        </Stack>

        {docUrl ? (
          <Box className="mt-2">
            <Typography variant="body2" color="text.secondary" className="mb-1">
              {successLabel}
            </Typography>
            <iframe title={previewTitle} src={docUrl} className="pdf-preview-frame" />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" className="mt-2">
            {emptyLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
