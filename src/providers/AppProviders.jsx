import { useEffect, useMemo } from "react";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { useThemeStore } from "../store/themeStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }) => {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#0a5bd8" : "#63a4ff",
          },
          secondary: {
            main: mode === "light" ? "#0f766e" : "#2dd4bf",
          },
          background: {
            default: mode === "light" ? "#f2f6fb" : "#050a16",
            paper: mode === "light" ? "#ffffff" : "#0b1220",
          },
          text: {
            primary: mode === "light" ? "#0f172a" : "#e2e8f0",
            secondary: mode === "light" ? "#475569" : "#94a3b8",
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: "'Manrope', 'Sora', 'Helvetica Neue', sans-serif",
          h1: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
          h2: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
          h3: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
          h4: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
          h5: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
          h6: { fontFamily: "'Sora', sans-serif", fontWeight: 700 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: "none",
                fontWeight: 700,
                paddingInline: 18,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 10,
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
