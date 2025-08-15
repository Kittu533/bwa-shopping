"use client";

import * as React from "react";
import {
    IconArchive,
    IconBox,
    IconBuilding,
    IconDashboard,
    IconMap,
    IconTrolley,
    IconUser,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
// import prisma from "../../../../../../lib/prisma";
// import { validateRequest } from "@/lib/auth";
// mengambil data user dan navMain
// async function getUserData() {
//     const { session } = await validateRequest();
//     if (!session?.user?.email) return null;
//     const user = await prisma.user.findUnique({
//         where: { email: session.user.email },
//         select: {
//             name: true,
//             email: true,
//         },
//     });
//     if (!user) return null;
//     return {
//         name: user.name,
//         email: user.email,
//     };
// }
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
        { title: "Categories", url: "/dashboard/categories", icon: IconArchive },
        { title: "Location", url: "/dashboard/locations", icon: IconMap },
        { title: "Brands", url: "/dashboard/brands", icon: IconBuilding },
        { title: "Products", url: "/dashboard/products", icon: IconBox },
        { title: "Orders", url: "/dashboard/orders", icon: IconTrolley },
        { title: "Customers", url: "/dashboard/customers", icon: IconUser },
    ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>{/* logo/brand di sini kalau perlu */}</SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
