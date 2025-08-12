
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metaData = {
  title: "Dashboard",
  description: "Admin dashboard"
}

export default async function Page() {

  const { session, user } = await validateRequest();

  if (!session || !user || user.role !== "superadmin") {
    return redirect('/dashboard/signin')
  }

  return (
    <html lang="en">
      <body>

      </body>
    </html>
  )
}
