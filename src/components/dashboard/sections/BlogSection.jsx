import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBlogPostRequest,
  deleteBlogPostRequest,
  getAdminBlogPostsRequest,
  updateBlogPostRequest,
} from "../../../api/blogApi";

const parseList = (s = "") => s.split(",").map((x) => x.trim()).filter(Boolean);
const emptyForm = { title: "", slug: "", excerpt: "", content: "", tags: "", published: true };

export const BlogSection = () => {
  const queryClient = useQueryClient();
  const blogQ = useQuery({ queryKey: ["admin-blog-posts"], queryFn: getAdminBlogPostsRequest });

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const createMut = useMutation({
    mutationFn: createBlogPostRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setForm(emptyForm);
      setShowForm(false);
      setStatus("Blog post created.");
    },
  });

  const updateMut = useMutation({
    mutationFn: updateBlogPostRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setStatus("Blog post updated.");
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteBlogPostRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setStatus("Post deleted.");
    },
  });

  const onField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync({ ...form, tags: parseList(form.tags) });
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to create post.");
    }
  };

  return (
    <>
      <div className="section-page-header">
        <h2>Blog Posts</h2>
        <p>Create, publish, and delete blog posts.</p>
      </div>

      {status && (
        <div className={`cms-status-strip ${status.toLowerCase().includes("fail") ? "error" : "success"}`}>
          {status}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm((p) => !p)}>
          {showForm ? "Cancel" : "New Blog Post"}
        </Button>
      </div>

      {showForm && (
        <div className="cms-card">
          <div className="cms-card-title">New Blog Post</div>
          <Stack component="form" spacing={2} onSubmit={submit}>
            <TextField name="title" label="Title" value={form.title} onChange={onField} required />
            <TextField name="slug" label="Slug (auto-generated if empty)" value={form.slug} onChange={onField} />
            <TextField name="excerpt" label="Excerpt" value={form.excerpt} onChange={onField} multiline minRows={2} />
            <TextField name="content" label="Content" value={form.content} onChange={onField} required multiline minRows={5} />
            <TextField name="tags" label="Tags (comma-separated)" value={form.tags} onChange={onField} />
            <FormControlLabel
              control={<Checkbox name="published" checked={form.published} onChange={onField} />}
              label="Published"
            />
            <Button type="submit" variant="contained" disabled={createMut.isPending} sx={{ alignSelf: "flex-start" }}>
              {createMut.isPending ? "Creating…" : "Create Post"}
            </Button>
          </Stack>
        </div>
      )}

      {blogQ.isLoading && <Typography color="text.secondary">Loading posts…</Typography>}

      {(blogQ.data || []).map((post) => (
        <div className="project-cms-card" key={post._id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div className="project-cms-card-title">{post.title}</div>
              <div className="project-cms-card-meta">/{post.slug} · {post.published ? "Published" : "Draft"}</div>
            </div>
            <Stack direction="row" gap={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => updateMut.mutate({ id: post._id, payload: { published: !post.published } })}
                disabled={updateMut.isPending}
              >
                {post.published ? "Unpublish" : "Publish"}
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => deleteMut.mutate(post._id)}
                disabled={deleteMut.isPending}
              >
                Delete
              </Button>
            </Stack>
          </div>
        </div>
      ))}

      {!blogQ.isLoading && (blogQ.data || []).length === 0 && (
        <Typography color="text.secondary">No blog posts yet.</Typography>
      )}
    </>
  );
};
