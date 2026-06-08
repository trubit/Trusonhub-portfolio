import { useState } from "react";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { apiClient } from "../../../api/client";
import { useAuth } from "../../../hooks/useAuth";
import { useThemeStore } from "../../../store/themeStore";

export const SettingsSection = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { mode, toggleMode } = useThemeStore();

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwStatus, setPwStatus] = useState({ type: "", message: "" });

  const changePwMut = useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post("/auth/change-password", payload);
      return data;
    },
    onSuccess: () => {
      setPwStatus({ type: "success", message: "Password changed successfully." });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    },
    onError: (err) => {
      setPwStatus({ type: "error", message: err.response?.data?.message || "Failed to change password." });
    },
  });

  const onPwField = (e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitPw = (e) => {
    e.preventDefault();
    setPwStatus({ type: "", message: "" });
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }
    changePwMut.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  return (
    <>
      <div className="section-page-header">
        <h2>Settings</h2>
        <p>Account security and appearance preferences.</p>
      </div>

      {/* Account Info */}
      <div className="cms-card">
        <div className="cms-card-title">Account Information</div>
        <Stack spacing={1}>
          <Typography variant="body2"><strong>Name:</strong> {user?.fullName}</Typography>
          <Typography variant="body2"><strong>Email:</strong> {user?.email}</Typography>
          <Typography variant="body2"><strong>Role:</strong> {user?.role}</Typography>
        </Stack>
      </div>

      {/* Change Password */}
      <div className="cms-card">
        <div className="cms-card-title">Change Password</div>
        {pwStatus.message && (
          <Alert severity={pwStatus.type === "success" ? "success" : "error"} sx={{ mb: 2 }}>
            {pwStatus.message}
          </Alert>
        )}
        <Stack component="form" spacing={2} onSubmit={submitPw}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={pwForm.currentPassword}
            onChange={onPwField}
            required
            autoComplete="current-password"
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={pwForm.newPassword}
            onChange={onPwField}
            required
            autoComplete="new-password"
            helperText="Minimum 8 characters"
          />
          <TextField
            label="Confirm New Password"
            name="confirm"
            type="password"
            value={pwForm.confirm}
            onChange={onPwField}
            required
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" disabled={changePwMut.isPending} sx={{ alignSelf: "flex-start" }}>
            {changePwMut.isPending ? "Updating…" : "Update Password"}
          </Button>
        </Stack>
      </div>

      {/* Appearance */}
      <div className="cms-card">
        <div className="cms-card-title">Appearance</div>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="body2">Current theme: <strong>{mode === "light" ? "Light" : "Dark"}</strong></Typography>
          <Button
            variant="outlined"
            startIcon={mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            onClick={toggleMode}
          >
            Switch to {mode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Stack>
      </div>

      {/* Logout */}
      <div className="cms-card">
        <div className="cms-card-title">Session</div>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Log Out
          </Button>
          <Button variant="text" component={Link} to="/">
            Back to Website
          </Button>
        </Stack>
      </div>
    </>
  );
};
