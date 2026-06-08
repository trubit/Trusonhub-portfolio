import { useRef } from "react";

import { Button, Card, Form, Stack } from "react-bootstrap";

export const ProjectGallery = ({
  images,
  uploading,
  deletingImageId,
  onUpload,
  onDelete,
}) => {
  const fileInputRef = useRef(null);

  const triggerSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    onUpload(files);
    event.target.value = "";
  };

  return (
    <Card className="project-media-card h-100">
      <Card.Body>
        <Card.Title as="h5">Project Images</Card.Title>
        <Card.Text className="text-muted">
          Upload one or many project images, preview in gallery, then download or delete.
        </Card.Text>

        <Stack direction="horizontal" gap={2} className="mb-3 flex-wrap">
          <Button onClick={triggerSelectFiles} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Project Images"}
          </Button>
          <Form.Control
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="d-none"
            onChange={handleFileChange}
          />
        </Stack>

        {images.length === 0 ? (
          <div className="project-media-empty">No project images uploaded yet.</div>
        ) : (
          <div className="project-image-grid">
            {images.map((item) => (
              <Card key={item._id} className="project-image-item">
                <Card.Body>
                  <img
                    src={item.url}
                    alt={item.fileName || "Project image"}
                    className="project-image-preview"
                  />
                  <Stack direction="horizontal" gap={2} className="mt-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => onDelete(item)}
                      disabled={deletingImageId === item._id}
                    >
                      {deletingImageId === item._id ? "Deleting..." : "Delete"}
                    </Button>
                  </Stack>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
