import '../../globalAdmin.css'; // Pastikan path ini benar sesuai struktur folder kamu

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <>
        {children}
      </>

  );
}