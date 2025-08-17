import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import QuestionPage from "./pages/question/QuestionPage";
import SnippetPage from "./pages/snippet/SnippetPage";
import AccountPage from "./pages/account/AccountPage";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import { RequireAuth, RequireGuest } from "./app/providers/route-guards";
import CreatePage from "./pages/create/CreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { AuthProvider } from "./app/providers/auth";
import { ThemeProvider } from "./app/providers/theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "questions/:id", element: <QuestionPage /> },
      { path: "snippets/:id", element: <SnippetPage /> },
      { path: "account", element: <AccountPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: "create", element: <CreatePage /> }],
      },
      {
        element: <RequireGuest />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
