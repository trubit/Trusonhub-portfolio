import { Button, Chip, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAdminContactMessageRequest,
  getAdminContactMessagesRequest,
  updateAdminContactMessageRequest,
} from "../../../api/contactApi";

const STATUS_COLORS = { new: "error", read: "warning", replied: "success" };
const NEXT_STATUS = { new: "read", read: "replied", replied: "new" };

export const MessagesSection = () => {
  const queryClient = useQueryClient();
  const messagesQ = useQuery({ queryKey: ["admin-contact-messages"], queryFn: getAdminContactMessagesRequest });

  const updateMut = useMutation({
    mutationFn: updateAdminContactMessageRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAdminContactMessageRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] }),
  });

  const messages = messagesQ.data || [];
  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <>
      <div className="section-page-header">
        <h2>Contact Messages</h2>
        <p>{newCount > 0 ? `${newCount} unread message${newCount > 1 ? "s" : ""}` : "All messages read."}</p>
      </div>

      {messagesQ.isLoading && <Typography color="text.secondary">Loading messages…</Typography>}

      {messages.length === 0 && !messagesQ.isLoading && (
        <Typography color="text.secondary">No messages yet.</Typography>
      )}

      {messages.map((msg) => (
        <div className="project-cms-card" key={msg._id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div className="project-cms-card-title" style={{ margin: 0 }}>{msg.subject || "(no subject)"}</div>
                <Chip
                  label={msg.status}
                  size="small"
                  color={STATUS_COLORS[msg.status] || "default"}
                />
              </div>
              <div className="project-cms-card-meta">
                {msg.name} · {msg.email} {msg.company ? `· ${msg.company}` : ""}
              </div>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{msg.message}</Typography>
            </div>
            <Stack direction="row" gap={1} flexShrink={0}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => updateMut.mutate({ id: msg._id, payload: { status: NEXT_STATUS[msg.status] || "new" } })}
                disabled={updateMut.isPending}
              >
                Mark as {NEXT_STATUS[msg.status] || "new"}
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => deleteMut.mutate(msg._id)}
                disabled={deleteMut.isPending}
              >
                Delete
              </Button>
            </Stack>
          </div>
        </div>
      ))}
    </>
  );
};
