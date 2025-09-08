import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import QuestionDetailsPage from "@/pages/item/QuestionDetailsPage";
import SnippetDetailsPage from "@/pages/item/SnippetDetailsPage";
import AccountPage from "@/pages/account/AccountPage";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import RegisterPage from "@/pages/auth/RegisterPage.tsx";
import { RequireAuth, RequireGuest } from "@/app/providers/route-guards";
import CreatePage from "@/pages/create/CreatePage";
import MyItemsPage from "@/pages/my/MyItemsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { AuthProvider } from "@/app/providers/auth";
import { ThemeProvider } from "@/app/providers/theme";
import { NotificationsProvider } from "@/app/providers/notifications-context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "questions/:id", element: <QuestionDetailsPage /> },
      { path: "snippets/:id", element: <SnippetDetailsPage /> },
      { path: "account", element: <AccountPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "create", element: <CreatePage /> },
          { path: "my", element: <MyItemsPage /> },
        ],
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
          <NotificationsProvider>
            <RouterProvider router={router} />
          </NotificationsProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
