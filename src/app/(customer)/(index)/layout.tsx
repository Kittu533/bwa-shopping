// src/app/(customer)/(auth)/layout.tsx
import "../../globalLanding.css";
import { Toaster } from "sonner";

export default function LandingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}