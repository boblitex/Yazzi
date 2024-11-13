import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Getting Started',
            url: '#',
            items: [
                {
                    title: 'Installation',
                    url: '#',
                },
                {
                    title: 'Project Structure',
                    url: '#',
                },
            ],
        },
        {
            title: 'Building Your Application',
            url: '#',
            items: [
                {
                    title: 'Routing',
                    url: '#',
                },
                {
                    title: 'Data Fetching',
                    url: '#',
                },
                {
                    title: 'Rendering',
                    url: '#',
                },
                {
                    title: 'Caching',
                    url: '#',
                },
                {
                    title: 'Styling',
                    url: '#',
                },
                {
                    title: 'Optimizing',
                    url: '#',
                },
                {
                    title: 'Configuring',
                    url: '#',
                },
                {
                    title: 'Testing',
                    url: '#',
                },
                {
                    title: 'Authentication',
                    url: '#',
                },
                {
                    title: 'Deploying',
                    url: '#',
                },
                {
                    title: 'Upgrading',
                    url: '#',
                },
                {
                    title: 'Examples',
                    url: '#',
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                        >
                            <div className="flex justify-between items-center">
                                <Image
                                    src="/logo.svg"
                                    alt="yazzi - ask.discover.empower"
                                    width={130}
                                    height={35}
                                    priority
                                />
                                <ThemeToggle />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a
                                        href={item.url}
                                        className="font-medium"
                                    >
                                        {item.title}
                                    </a>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={item.isActive}
                                                >
                                                    <a href={item.url}>
                                                        {item.title}
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
