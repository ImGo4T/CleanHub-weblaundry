import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order, type PaginatedData, type StatusOption } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, CreditCard, Package, Plus, Search, ShoppingCart, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/orders' },
];

const fmt = (amount: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));

const payLabels: Record<string, { label: string; color: string }> = {
    unpaid: { label: 'Belum Bayar', color: 'red' },
    partial: { label: 'Sebagian', color: 'yellow' },
    paid: { label: 'Lunas', color: 'green' },
};

export default function OrdersIndex({ orders, filters, statuses }: { orders: PaginatedData<Order>; filters: { status?: string; search?: string }; statuses: StatusOption[] }) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        router.get('/orders', { search: fd.get('search') as string, status: filters.status || '' }, { preserveState: true });
    };

    const handleFilter = (status: string) => {
        router.get('/orders', { search: filters.search || '', status }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" /> Daftar Orders
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{orders.total} total order</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/orders/create"><Plus className="mr-2 h-4 w-4" /> Order Baru</Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input name="search" placeholder="Cari kode order atau nama pelanggan..." defaultValue={filters.search} className="pl-10" />
                        </div>
                    </form>
                    <Select value={filters.status || 'all'} onValueChange={(v: string) => handleFilter(v === 'all' ? '' : v)}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop Table */}
                <Card className="hidden md:block overflow-hidden">
                    <CardContent className="p-0">
                        {orders.data.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pelanggan</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layanan</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pembayaran</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {orders.data.map((o) => {
                                            const si = statuses.find((s) => s.value === o.status) || { label: o.status, color: 'blue' };
                                            const pi = payLabels[o.payment_status] || { label: o.payment_status, color: 'blue' };
                                            return (
                                                <tr key={o.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="py-3.5 px-5">
                                                        <Link href={`/orders/${o.id}`} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">{o.order_code}</Link>
                                                    </td>
                                                    <td className="py-3.5 px-5 font-medium">{o.customer?.user?.name || '-'}</td>
                                                    <td className="py-3.5 px-5 text-muted-foreground">{o.service?.name || '-'}</td>
                                                    <td className="py-3.5 px-5 font-semibold tabular-nums">{fmt(o.total_price)}</td>
                                                    <td className="py-3.5 px-5"><StatusBadge color={si.color} label={si.label} /></td>
                                                    <td className="py-3.5 px-5"><StatusBadge color={pi.color} label={pi.label} /></td>
                                                    <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                                                        {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-3 md:hidden">
                    {orders.data.length === 0 ? <EmptyState /> : orders.data.map((o) => {
                        const si = statuses.find((s) => s.value === o.status) || { label: o.status, color: 'blue' };
                        const pi = payLabels[o.payment_status] || { label: o.payment_status, color: 'blue' };
                        return (
                            <Card key={o.id} className="overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <Link href={`/orders/${o.id}`} className="font-semibold text-blue-600">{o.order_code}</Link>
                                        <div className="flex gap-1.5">
                                            <StatusBadge color={si.color} label={si.label} />
                                            <StatusBadge color={pi.color} label={pi.label} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground"><User className="h-3.5 w-3.5" />{o.customer?.user?.name || '-'}</div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground"><CreditCard className="h-3.5 w-3.5" />{fmt(o.total_price)}</div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground"><Package className="h-3.5 w-3.5" />{o.service?.name || '-'}</div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />{new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center gap-1 flex-wrap">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-muted border'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4"><ShoppingCart className="h-8 w-8 text-muted-foreground" /></div>
            <p className="font-medium text-muted-foreground">Belum ada order</p>
            <Link href="/orders/create" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                <Plus className="h-3 w-3" /> Buat Order Pertama
            </Link>
        </div>
    );
}
