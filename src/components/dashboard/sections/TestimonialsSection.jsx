import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTestimonialRequest,
  deleteTestimonialRequest,
  getTestimonialsRequest,
  updateTestimonialRequest,
} from "../../../api/testimonialApi";
import { uploadMediaImageRequest } from "../../../api/uploadApi";

const emptyForm = { name: "", role: "", company: "", quote: "", avatarUrl: "", featured: false };

export const TestimonialsSection = () => {
  const queryClient = useQueryClient();
  const testimonialsQ = useQuery({ queryKey: ["testimonials"], queryFn: getTestimonialsRequest });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [status, setStatus] = useState("");

  const avatarInputRef = useRef(null);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, role: t.role || "", company: t.company || "", quote: t.quote, avatarUrl: t.avatarUrl || "", featured: Boolean(t.featured) }); setOpen(true); };

  const createMut = useMutation({
    mutationFn: createTestimonialRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["testimonials"] }); setOpen(false); setStatus("Testimonial added."); },
  });

  const updateMut = useMutation({
    mutationFn: updateTestimonialRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["testimonials"] }); setOpen(false); setStatus("Testimonial updated."); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteTestimonialRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["testimonials"] }); setStatus("Testimonial deleted."); },
  });

  const onField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadMediaImageRequest(file);
      setForm((p) => ({ ...p, avatarUrl: res.url }));
    } catch { setStatus("Avatar upload failed."); }
    finally { setUploadingAvatar(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateMut.mutateAsync({ id: editing._id, payload: form });
    else await createMut.mutateAsync(form);
  };

  return (
    <>
      <div className="section-page-header">
        <h2>Testimonials</h2>
        <p>Add and manage recommendations from clients and colleagues.</p>
      </div>

      {status && (
        <div className={`cms-status-strip ${status.toLowerCase().includes("fail") ? "error" : "success"}`}>{status}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Testimonial</Button>
      </div>

      {testimonialsQ.isLoading && <Typography color="text.secondary">Loading…</Typography>}

      {(testimonialsQ.data || []).map((t) => (
        <div className="testimonial-cms-card" key={t._id}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {t.avatarUrl && (
              <img src={t.avatarUrl} alt={t.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <strong>{t.name}</strong>
                {t.featured ? <StarIcon fontSize="small" color="warning" /> : <StarBorderIcon fontSize="small" />}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{t.role} {t.company ? `· ${t.company}` : ""}</div>
              <p className="testimonial-quote">"{t.quote}"</p>
            </div>
            <Stack direction="column" sx={{ gap: 1, flexShrink: 0 }}>
              <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(t)}>Edit</Button>
              <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteMut.mutate(t._id)} disabled={deleteMut.isPending}>Delete</Button>
            </Stack>
          </div>
        </div>
      ))}

      {!testimonialsQ.isLoading && (testimonialsQ.data || []).length === 0 && (
        <Typography color="text.secondary">No testimonials yet.</Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
        <DialogContent>
          <Stack component="form" id="testimonial-form" spacing={2} sx={{ pt: 1 }} onSubmit={save}>
            <TextField label="Name" name="name" value={form.name} onChange={onField} required />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth label="Role / Title" name="role" value={form.role} onChange={onField} />
              <TextField fullWidth label="Company" name="company" value={form.company} onChange={onField} />
            </Stack>
            <TextField label="Quote / Testimonial" name="quote" value={form.quote} onChange={onField} required multiline minRows={3} />
            <input ref={avatarInputRef} aria-hidden="true" hidden type="file" accept="image/*" onChange={uploadAvatar} />
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Button variant="outlined" size="small" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}>
                {uploadingAvatar ? "Uploading…" : form.avatarUrl ? "Replace Avatar" : "Upload Avatar"}
              </Button>
              {form.avatarUrl && <img src={form.avatarUrl} alt="" style={{ height: 40, width: 40, borderRadius: "50%", objectFit: "cover" }} />}
            </Stack>
            <FormControlLabel
              control={<Checkbox name="featured" checked={form.featured} onChange={onField} />}
              label="Feature this testimonial"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="testimonial-form" variant="contained" disabled={createMut.isPending || updateMut.isPending}>
            {createMut.isPending || updateMut.isPending ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
