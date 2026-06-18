import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order, type Payment } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Banknote, CalendarDays, CheckCircle2, CreditCard, Receipt, Wallet } from 'lucide-react';

const fmt = (amount: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));

const methodLabels: Record<string, string> = { cash: 'Tunai', transfer: 'Transfer', 'e-wallet': 'E-Wallet' };
const statusColors: Record<string, string> = { pending: 'yellow', verified: 'green', failed: 'red' };
const statusLabels: Record<string, string> = { pending: 'Pending', verified: 'Terverifikasi', failed: 'Gagal' };
const methodIcons: Record<string, React.ReactNode> = {
    cash: <Banknote className="h-3.5 w-3.5" />,
    transfer: <CreditCard className="h-3.5 w-3.5" />,
    'e-wallet': <Wallet className="h-3.5 w-3.5" />,
};

export default function PaymentsIndex({ order, payments }: { order: Order; payments: Payment[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        order_id: String(order.id), amount: '', method: 'cash', reference: '',
    });

    const totalPaid = payments.filter((p) => p.status === 'verified').reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = Number(order.total_price) - totalPaid;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/orders' },
        { title: order.order_code, href: `/orders/${order.id}` },
        { title: 'Pembayaran', href: `/orders/${order.id}/payments` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pembayaran: ${order.order_code}`} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-emerald-500" /> Pembayaran
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Order <Link href={`/orders/${order.id}`} className="text-blue-600 font-medium hover:underline">{order.order_code}</Link>
                        </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                        <Link href={`/orders/${order.id}`}><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total Tagihan</p>
                            <p className="text-lg font-bold tabular-nums">{fmt(order.total_price)}</p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                            <p className="text-xs text-green-600/80 mb-1">Sudah Dibayar</p>
                            <p className="text-lg font-bold text-green-700 tabular-nums">{fmt(totalPaid)}</p>
                        </CardContent>
                    </Card>
                    <Card className={`overflow-hidden ${remaining > 0 ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'}`}>
                        <CardContent className="p-4">
                            <p className={`text-xs mb-1 ${remaining > 0 ? 'text-red-600/80' : 'text-green-600/80'}`}>Sisa Tagihan</p>
                            <p className={`text-lg font-bold tabular-nums ${remaining > 0 ? 'text-red-700' : 'text-green-700'}`}>{fmt(remaining)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Add Payment Form */}
                {remaining > 0 && (
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold text-sm">Catat Pembayaran</span>
                        </div>
                        <CardContent className="pt-4">
                            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); post('/payments', { onSuccess: () => reset('amount', 'reference') }); }} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Jumlah <span className="text-red-400">*</span></Label>
                                        <Input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder={String(remaining)} min="1" />
                                        {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Metode <span className="text-red-400">*</span></Label>
                                        <Select value={data.method} onValueChange={(v) => setData('method', v as 'cash' | 'transfer' | 'e-wallet')}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Tunai</SelectItem>
                                                <SelectItem value="transfer">Transfer</SelectItem>
                                                <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.method && <p className="text-xs text-red-500">{errors.method}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Referensi (opsional)</Label>
                                        <Input value={data.reference} onChange={(e) => setData('reference', e.target.value)} placeholder="No. transfer / bukti" />
                                        {errors.reference && <p className="text-xs text-red-500">{errors.reference}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                        {processing ? 'Menyimpan...' : 'Bayar Sekarang'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                <Card className="overflow-hidden">
                    <div className="border-b px-5 py-3.5 flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-sm">Riwayat Pembayaran</span>
                    </div>
                    <CardContent className="p-0">
                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-muted p-4 mb-3"><Receipt className="h-8 w-8 text-muted-foreground" /></div>
                                <p className="text-sm text-muted-foreground font-medium">Belum ada pembayaran</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/40">
                                                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal</th>
                                                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jumlah</th>
                                                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metode</th>
                                                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Referensi</th>
                                                <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                                <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {payments.map((p) => (
                                                <tr key={p.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{new Date(p.created_at).toLocaleString('id-ID')}</span>
                                                    </td>
                                                    <td className="py-3.5 px-5 font-semibold tabular-nums">{fmt(p.amount)}</td>
                                                    <td className="py-3.5 px-5">
                                                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">{methodIcons[p.method]}{methodLabels[p.method] || p.method}</span>
                                                    </td>
                                                    <td className="py-3.5 px-5 text-muted-foreground">{p.reference || <span className="italic">-</span>}</td>
                                                    <td className="py-3.5 px-5"><StatusBadge color={statusColors[p.status] || 'blue'} label={statusLabels[p.status] || p.status} /></td>
                                                    <td className="py-3.5 px-5 text-right">
                                                        {p.status === 'pending' && (
                                                            <Button variant="outline" size="sm" onClick={() => router.patch(`/payments/${p.id}/verify`)} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Verifikasi
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile */}
                                <div className="flex flex-col divide-y md:hidden">
                                    {payments.map((p) => (
                                        <div key={p.id} className="p-4 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold tabular-nums">{fmt(p.amount)}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleString('id-ID')}</p>
                                                </div>
                                                <StatusBadge color={statusColors[p.status] || 'blue'} label={statusLabels[p.status] || p.status} />
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1.5 text-muted-foreground">{methodIcons[p.method]}{methodLabels[p.method]}</span>
                                                {p.status === 'pending' && (
                                                    <Button variant="outline" size="sm" onClick={() => router.patch(`/payments/${p.id}/verify`)} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs">
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />Verifikasi
                                                    </Button>
                                                )}
                                            </div>
                                            {p.reference && <p className="text-xs text-muted-foreground">Ref: {p.reference}</p>}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
