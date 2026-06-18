import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CreditCard, LayoutGrid, Package, ShoppingBag, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as unknown as { auth: { user: { role: string } } };
    const userRole = auth?.user?.role;
    const isAdminOrOperator = userRole === 'admin' || userRole === 'operator';
    const isAdmin = userRole === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        ...(isAdminOrOperator
            ? [
                  {
                      title: 'Orders',
                      url: '/orders',
                      icon: ShoppingBag,
                  },
                  {
                      title: 'Customers',
                      url: '/customers',
                      icon: Users,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      title: 'Services',
                      url: '/services',
                      icon: Package,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
