"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface layoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const layout = ({ children }: layoutProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default layout;
