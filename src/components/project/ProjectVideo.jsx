import { useRef, useState } from "react";

import { Button, Card, Form, Stack } from "react-bootstrap";

export const ProjectVideo = ({
  videos,
  uploading,
  deletingVideoId,
  onUpload,
  onDelete,
}) => {
  const fileInputRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState("");

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onUpload({
      file,
      title: videoTitle,
    });

    event.target.value = "";
    setVideoTitle("");
  };

  return (
    <Card className="project-media-card h-100">
      <Card.Body>
        <Card.Title as="h5">Project Video</Card.Title>
        <Card.Text className="text-muted">
          Upload project video, preview on screen, then download or delete.
        </Card.Text>

        <Stack direction="horizontal" gap={2} className="mb-2 flex-wrap">
          <Form.Control
            type="text"
            placeholder="Video title (optional)"
            value={videoTitle}
            onChange={(event) => setVideoTitle(event.target.value)}
            className="project-media-input"
          />
          <Button onClick={triggerSelectFile} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Project Video"}
          </Button>
          <Form.Control
            ref={fileInputRef}
            type="file"
            accept="video/mp4"
            className="d-none"
            onChange={handleChange}
          />
        </Stack>

        {videos.length === 0 ? (
          <div className="project-media-empty">No project videos uploaded yet.</div>
        ) : (
          <div className="project-media-list">
            {videos.map((item) => (
              <Card key={item._id} className="project-media-item mb-3">
                <Card.Body>
                  {item.title ? (
                    <Card.Subtitle className="mb-2">{item.title}</Card.Subtitle>
                  ) : null}
                  <video controls className="project-video-player" src={item.url} />
                  <Stack direction="horizontal" gap={2} className="mt-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download Video
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => onDelete(item)}
                      disabled={deletingVideoId === item._id}
                    >
                      {deletingVideoId === item._id ? "Deleting..." : "Delete Video"}
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
