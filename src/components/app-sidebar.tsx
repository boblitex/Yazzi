'use client';

import { useQuery } from 'convex/react';
import * as React from 'react';
import { api } from '../../convex/_generated/api';

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
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const prompts = useQuery(api.prompts.get);

    const data = {
        navMain: [
            {
                title: 'Prompts',
                url: '/',
                items:
                    prompts?.map((prompt) => ({
                        title: prompt.request,
                        url: `/${prompt._id}`,
                        isActive: false,
                    })) ?? [],
            },
        ],
    };

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
                                    <Link
                                        href={item.url}
                                        className="font-medium"
                                    >
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={item.isActive}
                                                >
                                                    <Link href={item.url}>
                                                        {item.title}
                                                    </Link>
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
