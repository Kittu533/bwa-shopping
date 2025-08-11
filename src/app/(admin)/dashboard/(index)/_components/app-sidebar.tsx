"use client"

import * as React from "react"
import {
    IconArchive,
    IconBox,
    IconBuilding,
    IconDashboard,
    IconMap,
    IconUser,

} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: IconDashboard,
        },
        {
            title: "Categories",
            url: "dashboard/categories",
            icon: IconArchive,
        },
        {
            title: "Location",
            url: "dashboard/location",
            icon: IconMap,
        },
        {
            title: "Brands",
            url: "dashboard/brands",
            icon: IconBuilding,
        },
        {
            title: "Orders",
            url: "dashboard/orders",
            icon: IconBox,
        },
        {
            title: "Customers",
            url: "dashboard/customers",
            icon: IconUser,
        },

    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
