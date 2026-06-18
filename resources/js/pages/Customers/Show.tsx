import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Customer, type Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CreditCard, Edit, Mail, MapPin, Package, Phone, ShoppingBag, Trash2, User, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

const fmt = (amount: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));

const tierBadge: Record<string, string> = {
    bronze: 'bg-amber-50 text-amber-700 border-amber-200',
    silver: 'bg-gray-50 text-gray-600 border-gray-200',
    gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const statusColors: Record<string, string> = {
    diterima: 'blue', dicuci: 'yellow', disetrika: 'orange', siap: 'green', diambil: 'teal', selesai: 'emerald', cancelled: 'red',
};

const payLabels: Record<string, { label: string; color: string }> = {
    unpaid: { label: 'Belum Bayar', color: 'red' },
    partial: { label: 'Sebagian', color: 'yellow' },
    paid: { label: 'Lunas', color: 'green' },
};

export default function CustomersShow({ customer }: { customer: Customer }) {
    const handleDelete = () => { if (confirm('Yakin ingin menghapus pelanggan ini?')) router.delete(`/customers/${customer.id}`); };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: customer.user?.name || 'Detail', href: `/customers/${customer.id}` }]}>
            <Head title={`Pelanggan: ${customer.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" /> Profil Pelanggan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Terdaftar sejak {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                            <Link href={`/customers/${customer.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit Pelanggan</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={<ShoppingBag className="h-4 w-4 text-blue-500" />} value={String(customer.orders?.length || 0)} label="Total Order" />
                    <StatCard icon={<CreditCard className="h-4 w-4 text-emerald-500" />} value={fmt(customer.total_spent)} label="Total Belanja" />
                    <StatCard icon={<Package className="h-4 w-4 text-violet-500" />} value={String(customer.points)} label="Poin" />
                    <StatCard icon={<Users className="h-4 w-4 text-amber-500" />} value={customer.membership_tier} label="Membership" capitalize />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Profile Card */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Informasi Pelanggan</span>
                        </div>
                        <CardContent className="pt-4 space-y-3 text-sm">
                            <InfoRow icon={<User className="h-4 w-4" />} label="Nama" value={customer.user?.name || '-'} />
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={customer.user?.email || '-'} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Telepon" value={customer.user?.phone || '-'} />
                            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Alamat" value={customer.address || '-'} />
                            <div className="flex items-center justify-between gap-3 pt-3 border-t">
                                <span className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" />Membership</span>
                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${tierBadge[customer.membership_tier] || ''}`}>
                                    {customer.membership_tier}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active/Recent Orders summary */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold text-sm">Ringkasan Aktivitas</span>
                        </div>
                        <CardContent className="pt-4">
                            {customer.orders && customer.orders.length > 0 ? (
                                <div className="space-y-3">
                                    {customer.orders.slice(0, 5).map((o: Order) => {
                                        const pi = payLabels[o.payment_status] || { label: o.payment_status, color: 'blue' };
                                        return (
                                            <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                                                <div>
                                                    <p className="text-sm font-semibold text-blue-600">{o.order_code}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <CalendarDays className="h-3 w-3" />
                                                        {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold tabular-nums">{fmt(o.total_price)}</p>
                                                    <StatusBadge color={pi.color} label={pi.label} className="text-[10px]" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center py-8 text-sm text-muted-foreground">Belum ada order</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order History Table */}
                {customer.orders && customer.orders.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-violet-500" />
                            <span className="font-semibold text-sm">Riwayat Order</span>
                        </div>
                        <CardContent className="p-0">
                            {/* Desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pembayaran</th>
                                            <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {customer.orders.map((o: Order) => {
                                            const pi = payLabels[o.payment_status] || { label: o.payment_status, color: 'blue' };
                                            return (
                                                <tr key={o.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="py-3 px-5"><Link href={`/orders/${o.id}`} className="font-semibold text-blue-600 hover:underline">{o.order_code}</Link></td>
                                                    <td className="py-3 px-5 text-muted-foreground">{new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td className="py-3 px-5"><StatusBadge color={statusColors[o.status] || 'blue'} label={o.status} /></td>
                                                    <td className="py-3 px-5"><StatusBadge color={pi.color} label={pi.label} /></td>
                                                    <td className="py-3 px-5 text-right font-semibold tabular-nums">{fmt(o.total_price)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile */}
                            <div className="flex flex-col divide-y md:hidden">
                                {customer.orders.map((o: Order) => {
                                    const pi = payLabels[o.payment_status] || { label: o.payment_status, color: 'blue' };
                                    return (
                                        <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-muted/30">
                                            <div>
                                                <p className="text-sm font-semibold text-blue-600">{o.order_code}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                <div className="flex gap-1.5 mt-1.5">
                                                    <StatusBadge color={statusColors[o.status] || 'blue'} label={o.status} className="text-[10px]" />
                                                    <StatusBadge color={pi.color} label={pi.label} className="text-[10px]" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold tabular-nums">{fmt(o.total_price)}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
            </div>
        </AppLayout>
    );
}

function StatCard({ icon, value, label, capitalize }: { icon: React.ReactNode; value: string; label: string; capitalize?: boolean }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
                <p className={`text-lg font-bold ${capitalize ? 'capitalize' : 'tabular-nums'}`}>{value}</p>
            </CardContent>
        </Card>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground shrink-0">{icon}{label}</span>
            <span className="font-medium text-right truncate">{value}</span>
        </div>
    );
}
