import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCertificateRequest,
  deleteCertificateRequest,
  getCertificatesRequest,
  updateCertificateRequest,
} from "../../../api/certificateApi";
import { uploadMediaImageRequest } from "../../../api/uploadApi";

const emptyForm = { title: "", issuer: "", issueDate: "", credentialUrl: "", imageUrl: "", description: "" };

export const CertificatesSection = () => {
  const queryClient = useQueryClient();
  const certsQ = useQuery({ queryKey: ["certificates"], queryFn: getCertificatesRequest });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [status, setStatus] = useState("");

  const imgInputRef = useRef(null);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (cert) => { setEditing(cert); setForm({ title: cert.title, issuer: cert.issuer || "", issueDate: cert.issueDate || "", credentialUrl: cert.credentialUrl || "", imageUrl: cert.imageUrl || "", description: cert.description || "" }); setOpen(true); };

  const createMut = useMutation({
    mutationFn: createCertificateRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["certificates"] }); setOpen(false); setStatus("Certificate added."); },
  });

  const updateMut = useMutation({
    mutationFn: updateCertificateRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["certificates"] }); setOpen(false); setStatus("Certificate updated."); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteCertificateRequest,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["certificates"] }); setStatus("Certificate deleted."); },
  });

  const onField = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const uploadImg = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImg(true);
    try {
      const res = await uploadMediaImageRequest(file);
      setForm((p) => ({ ...p, imageUrl: res.url }));
    } catch { setStatus("Image upload failed."); }
    finally { setUploadingImg(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateMut.mutateAsync({ id: editing._id, payload: form });
    else await createMut.mutateAsync(form);
  };

  return (
    <>
      <div className="section-page-header">
        <h2>Certificates</h2>
        <p>Add and manage professional certificates.</p>
      </div>

      {status && (
        <div className={`cms-status-strip ${status.toLowerCase().includes("fail") ? "error" : "success"}`}>{status}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Certificate</Button>
      </div>

      {certsQ.isLoading && <Typography color="text.secondary">Loading…</Typography>}

      {(certsQ.data || []).map((cert) => (
        <div className="cert-card" key={cert._id}>
          {cert.imageUrl ? (
            <img src={cert.imageUrl} alt={cert.title} className="cert-card-img" />
          ) : (
            <div className="cert-card-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#94a3b8" }}>No image</div>
          )}
          <div className="cert-card-info">
            <div style={{ fontWeight: 700 }}>{cert.title}</div>
            <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{cert.issuer} {cert.issueDate ? `· ${cert.issueDate}` : ""}</div>
            {cert.description && <div style={{ fontSize: "0.8rem", marginTop: 4 }}>{cert.description}</div>}
            {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem" }}>View credential ↗</a>}
          </div>
          <Stack direction="column" sx={{ gap: 1, flexShrink: 0 }}>
            <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(cert)}>Edit</Button>
            <Button size="small" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteMut.mutate(cert._id)} disabled={deleteMut.isPending}>Delete</Button>
          </Stack>
        </div>
      ))}

      {!certsQ.isLoading && (certsQ.data || []).length === 0 && (
        <Typography color="text.secondary">No certificates yet.</Typography>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
        <DialogContent>
          <Stack component="form" id="cert-form" spacing={2} sx={{ pt: 1 }} onSubmit={save}>
            <TextField label="Title" name="title" value={form.title} onChange={onField} required />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth label="Issuer" name="issuer" value={form.issuer} onChange={onField} />
              <TextField fullWidth label="Issue Date" name="issueDate" value={form.issueDate} onChange={onField} placeholder="e.g. Jan 2024" />
            </Stack>
            <TextField label="Credential URL" name="credentialUrl" value={form.credentialUrl} onChange={onField} />
            <TextField label="Description" name="description" value={form.description} onChange={onField} multiline minRows={2} />
            <input ref={imgInputRef} aria-hidden="true" hidden type="file" accept="image/*" onChange={uploadImg} />
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Button variant="outlined" size="small" component="label" disabled={uploadingImg} onClick={() => imgInputRef.current?.click()}>
                {uploadingImg ? "Uploading…" : form.imageUrl ? "Replace Image" : "Upload Certificate Image"}
              </Button>
              {form.imageUrl && <img src={form.imageUrl} alt="" style={{ height: 48, borderRadius: 6 }} />}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="cert-form" variant="contained" disabled={createMut.isPending || updateMut.isPending}>
            {createMut.isPending || updateMut.isPending ? "Saving…" : editing ? "Save Changes" : "Add Certificate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
