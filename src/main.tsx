import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import setDefaultOptions from "date-fns/setDefaultOptions";
import ptBR from "date-fns/locale/pt-BR";

setDefaultOptions({ locale: ptBR });

const container = document.getElementById("root");
const root = createRoot(container!);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
