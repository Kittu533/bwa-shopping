
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import { AppSidebar } from "./_components/app-sidebar"
import Header from "./_components/header"
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metaData = {
    title: "Dashboard",
    description: "Admin dashboard"
}

export default async function Page() {
    const { session } = await validateRequest();
    if (!session) {
        return redirect('/dashboard/signin')
    }
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
