import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock,
    Package,
    Plus,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users,
    WashingMachine,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface AdminStats {
    today_orders: number;
    active_orders: number;
    today_revenue: number;
    total_customers: number;
    total_revenue: number;
    month_revenue: number;
}

interface PelangganStats {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    total_spent: number;
}

interface StatusBreakdown {
    status: string;
    label: string;
    color: string;
    count: number;
}

const fmt = (n: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n));

const statusLabels: Record<string, { label: string; color: string }> = {
    diterima: { label: 'Diterima', color: 'blue' },
    dicuci: { label: 'Dicuci', color: 'yellow' },
    disetrika: { label: 'Disetrika', color: 'orange' },
    siap: { label: 'Siap', color: 'green' },
    diambil: { label: 'Diambil', color: 'teal' },
    selesai: { label: 'Selesai', color: 'emerald' },
    cancelled: { label: 'Dibatalkan', color: 'red' },
};

const statusDotColors: Record<string, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
};

export default function Dashboard({
    stats,
    recent_orders,
    orders,
    status_breakdown,
}: {
    stats: AdminStats | PelangganStats;
    recent_orders?: Order[];
    orders?: Order[];
    status_breakdown?: StatusBreakdown[];
}) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'operator';
    const displayOrders = recent_orders || orders || [];
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const greeting = getGreeting();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">

                {/* ─── Header ─── */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            {greeting}, <span className="text-blue-600">{auth.user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" /> {today}
                        </p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/orders/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Order Baru
                        </Link>
                    )}
                </div>

                {/* ─── KPI Cards ─── */}
                {isAdmin ? <AdminKPI stats={stats as AdminStats} /> : <PelangganKPI stats={stats as PelangganStats} />}

                {/* ─── Pipeline + Quick Stats (Admin only) ─── */}
                {isAdmin && status_breakdown && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Status Pipeline */}
                        <Card className="lg:col-span-2 overflow-hidden">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-base font-semibold flex items-center gap-2">
                                    <WashingMachine className="h-4 w-4 text-blue-500" />
                                    Pipeline Order Aktif
                                </h2>
                            </div>
                            <CardContent className="pt-5 pb-5">
                                <div className="grid grid-cols-5 gap-3">
                                    {status_breakdown.map((s) => (
                                        <Link
                                            key={s.status}
                                            href={`/orders?status=${s.status}`}
                                            className="group flex flex-col items-center rounded-xl border p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm"
                                        >
                                            <div className={`mb-2.5 h-3 w-3 rounded-full ${statusDotColors[s.color] || 'bg-gray-400'}`} />
                                            <span className="text-2xl font-bold tabular-nums">{s.count}</span>
                                            <span className="mt-1 text-xs font-medium text-muted-foreground text-center leading-tight">
                                                {s.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue Summary */}
                        <Card className="overflow-hidden">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    Ringkasan Revenue
                                </h2>
                            </div>
                            <CardContent className="pt-5 space-y-4">
                                <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 p-4">
                                    <p className="text-xs font-medium text-emerald-600">Hari Ini</p>
                                    <p className="mt-1 text-xl font-bold text-emerald-900">{fmt((stats as AdminStats).today_revenue)}</p>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4">
                                    <p className="text-xs font-medium text-blue-600">Bulan Ini</p>
                                    <p className="mt-1 text-xl font-bold text-blue-900">{fmt((stats as AdminStats).month_revenue)}</p>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-4">
                                    <p className="text-xs font-medium text-violet-600">Total Keseluruhan</p>
                                    <p className="mt-1 text-xl font-bold text-violet-900">{fmt((stats as AdminStats).total_revenue)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ─── Recent Orders ─── */}
                <Card className="overflow-hidden">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            {isAdmin ? 'Order Terbaru' : 'Order Saya'}
                        </h2>
                        {isAdmin && (
                            <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                                Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </div>
                    {displayOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-gray-100 p-4 mb-4">
                                <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Belum ada order</p>
                            {isAdmin && (
                                <Link
                                    href="/orders/create"
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                    <Plus className="h-3 w-3" /> Buat Order Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</th>
                                            {isAdmin && <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pelanggan</th>}
                                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layanan</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {displayOrders.map((order) => {
                                            const si = statusLabels[order.status] || { label: order.status, color: 'blue' };
                                            return (
                                                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="py-3.5 px-6">
                                                        <Link href={`/orders/${order.id}`} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">{order.order_code}</Link>
                                                    </td>
                                                    {isAdmin && <td className="py-3.5 px-6 font-medium">{order.customer?.user?.name || '-'}</td>}
                                                    <td className="py-3.5 px-6 text-muted-foreground">{order.service?.name || '-'}</td>
                                                    <td className="py-3.5 px-6 font-semibold tabular-nums">{fmt(order.total_price)}</td>
                                                    <td className="py-3.5 px-6"><StatusBadge color={si.color} label={si.label} /></td>
                                                    <td className="py-3.5 px-6 text-muted-foreground whitespace-nowrap">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile Cards */}
                            <div className="flex flex-col divide-y md:hidden">
                                {displayOrders.map((order) => {
                                    const si = statusLabels[order.status] || { label: order.status, color: 'blue' };
                                    return (
                                        <Link key={order.id} href={`/orders/${order.id}`} className="flex items-start justify-between p-4 hover:bg-muted/30 transition-colors">
                                            <div>
                                                <p className="text-sm font-semibold text-blue-600">{order.order_code}</p>
                                                {isAdmin && <p className="text-xs text-muted-foreground mt-0.5">{order.customer?.user?.name || '-'}</p>}
                                                <p className="text-xs text-muted-foreground">{order.service?.name || '-'}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold tabular-nums">{fmt(order.total_price)}</p>
                                                <StatusBadge color={si.color} label={si.label} className="mt-1 text-[10px]" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

/* ─── KPI Card Components ─── */

function AdminKPI({ stats }: { stats: AdminStats }) {
    const cards = [
        { label: 'Order Hari Ini', value: stats.today_orders, icon: ShoppingCart, gradient: 'from-blue-500 to-blue-600' },
        { label: 'Order Aktif', value: stats.active_orders, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Revenue Hari Ini', value: fmt(stats.today_revenue), icon: Banknote, gradient: 'from-emerald-500 to-green-600' },
        { label: 'Total Pelanggan', value: stats.total_customers, icon: Users, gradient: 'from-violet-500 to-purple-600' },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon, gradient }) => (
                <Card key={label} className="overflow-hidden border-0 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                                <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
                            </div>
                            <div className={`rounded-xl bg-gradient-to-br ${gradient} p-2.5 shadow-sm`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function PelangganKPI({ stats }: { stats: PelangganStats }) {
    const cards = [
        { label: 'Total Order', value: stats.total_orders, icon: ShoppingCart, gradient: 'from-blue-500 to-blue-600' },
        { label: 'Sedang Diproses', value: stats.active_orders, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Selesai', value: stats.completed_orders, icon: CheckCircle2, gradient: 'from-emerald-500 to-green-600' },
        { label: 'Total Belanja', value: fmt(stats.total_spent), icon: Sparkles, gradient: 'from-violet-500 to-purple-600' },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon, gradient }) => (
                <Card key={label} className="overflow-hidden border-0 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                                <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
                            </div>
                            <div className={`rounded-xl bg-gradient-to-br ${gradient} p-2.5 shadow-sm`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}
