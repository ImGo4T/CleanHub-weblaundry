import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order, type StatusOption } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Package, RefreshCw, Truck, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/orders' },
];

const fmt = (amount: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));

const statusDotColors: Record<string, string> = {
    blue: 'bg-blue-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500', green: 'bg-green-500', teal: 'bg-teal-500', emerald: 'bg-emerald-500', red: 'bg-red-500',
};

const payInfo: Record<string, { label: string; color: string }> = {
    unpaid: { label: 'Belum Bayar', color: 'red' },
    partial: { label: 'Dibayar Sebagian', color: 'yellow' },
    paid: { label: 'Lunas', color: 'green' },
};

export default function OrdersShow({ order, statuses }: { order: Order; statuses: StatusOption[] }) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [notes, setNotes] = useState('');

    const handleUpdate = () => router.patch(`/orders/${order.id}/status`, { status: selectedStatus, notes });
    const handleCancel = () => { if (confirm('Yakin ingin membatalkan order ini?')) router.delete(`/orders/${order.id}`); };

    const si = statuses.find((s) => s.value === order.status) || { label: order.status, color: 'blue' };
    const pi = payInfo[order.payment_status] || { label: order.payment_status, color: 'blue' };
    const isActive = !['selesai', 'cancelled'].includes(order.status);

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: order.order_code, href: `/orders/${order.id}` }]}>
            <Head title={`Order ${order.order_code}`} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">{order.order_code}</h1>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(order.created_at).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <StatusBadge color={si.color} label={si.label} className="text-sm px-3 py-1" />
                        <StatusBadge color={pi.color} label={pi.label} className="text-sm px-3 py-1" />
                    </div>
                </div>

                {/* Info + Pricing Grid */}
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Order Info */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Informasi Order</span>
                        </div>
                        <CardContent className="pt-4 space-y-3 text-sm">
                            <InfoRow icon={<User className="h-4 w-4" />} label="Pelanggan" value={order.customer?.user?.name || '-'} />
                            <InfoRow icon={<Package className="h-4 w-4" />} label="Layanan" value={order.service?.name || '-'} />
                            <InfoRow icon={<Package className="h-4 w-4" />} label="Berat" value={order.total_weight ? `${order.total_weight} kg` : '-'} />
                            <InfoRow icon={<Package className="h-4 w-4" />} label="Jumlah Item" value={String(order.total_items || '-')} />
                            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Pickup" value={order.pickup_type === 'drop_off' ? 'Antar Sendiri' : 'Dijemput'} />
                            <InfoRow icon={<Truck className="h-4 w-4" />} label="Delivery" value={order.delivery_type === 'self_pickup' ? 'Ambil Sendiri' : 'Diantar'} />
                            <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Estimasi Siap" value={order.estimated_ready_at ? new Date(order.estimated_ready_at).toLocaleString('id-ID') : '-'} />
                            {order.notes && (
                                <div className="pt-3 border-t">
                                    <p className="text-xs text-muted-foreground mb-1">Catatan</p>
                                    <p className="text-sm">{order.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold text-sm">Ringkasan Harga</span>
                        </div>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium tabular-nums">{fmt(order.subtotal)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Diskon</span><span className="font-medium text-red-500 tabular-nums">-{fmt(order.discount)}</span></div>
                            <div className="flex justify-between border-t pt-3">
                                <span className="font-semibold">Total</span>
                                <span className="text-lg font-bold tabular-nums">{fmt(order.total_price)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Items Table */}
                {order.items && order.items.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <Package className="h-4 w-4 text-violet-500" />
                            <span className="font-semibold text-sm">Item Laundry</span>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Harga</th>
                                            <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-3 px-5 font-medium">{item.item_name}</td>
                                                <td className="py-3 px-5 tabular-nums">{item.quantity}</td>
                                                <td className="py-3 px-5 tabular-nums">{fmt(item.price)}</td>
                                                <td className="py-3 px-5 text-right font-semibold tabular-nums">{fmt(Number(item.price) * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Status Timeline */}
                {order.status_logs && order.status_logs.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-amber-500" />
                            <span className="font-semibold text-sm">Riwayat Status</span>
                        </div>
                        <CardContent className="pt-5">
                            <div className="space-y-4">
                                {order.status_logs.map((log, idx) => (
                                    <div key={log.id} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-3 w-3 rounded-full ${statusDotColors[statusDotColorFor(log.status)] || 'bg-gray-400'}`} />
                                            {idx < (order.status_logs?.length || 0) - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm font-semibold">{statuses.find((s) => s.value === log.status)?.label || log.status}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {log.changed_by_user?.name} — {new Date(log.created_at).toLocaleString('id-ID')}
                                            </p>
                                            {log.notes && <p className="text-xs text-muted-foreground mt-1 italic">{log.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                {isActive && (
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Update Status</span>
                        </div>
                        <CardContent className="pt-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Status Baru</label>
                                    <Select value={selectedStatus} onValueChange={(v: string) => setSelectedStatus(v as typeof selectedStatus)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleUpdate} className="flex-1 sm:flex-none">Update Status</Button>
                                    {order.status !== 'cancelled' && (
                                        <Button variant="destructive" onClick={handleCancel} className="flex-1 sm:flex-none">Batalkan</Button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Catatan (opsional)</label>
                                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan update status..." />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" asChild className="flex-1 sm:flex-none">
                        <Link href={`/orders/${order.id}/payments`}>
                            <CreditCard className="mr-2 h-4 w-4" /> Kelola Pembayaran
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground shrink-0">{icon}{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}

function statusDotColorFor(status: string): string {
    const map: Record<string, string> = { diterima: 'blue', dicuci: 'yellow', disetrika: 'orange', siap: 'green', diambil: 'teal', selesai: 'emerald', cancelled: 'red' };
    return map[status] || 'blue';
}
