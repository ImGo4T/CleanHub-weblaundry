import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Customer, type Service } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Package, Plus, Shirt, Trash2, Truck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/orders' },
    { title: 'Order Baru', href: '/orders/create' },
];

const fmt = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function OrdersCreate({ customers, services }: { customers: (Customer & { display_name: string })[]; services: Service[] }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '', service_id: '', total_weight: '', total_items: '',
        pickup_type: 'drop_off', delivery_type: 'self_pickup', notes: '',
        items: [{ item_name: '', quantity: 1, weight: '', price: '', notes: '' }],
    });

    const addItem = () => setData('items', [...data.items, { item_name: '', quantity: 1, weight: '', price: '', notes: '' }]);
    const removeItem = (i: number) => { if (data.items.length > 1) setData('items', data.items.filter((_, idx) => idx !== i)); };
    const updateItem = (i: number, f: string, v: string | number) => {
        const u = [...data.items]; (u[i] as Record<string, string | number>)[f] = v; setData('items', u);
    };
    const totalSubtotal = data.items.reduce((s, item) => s + item.quantity * Number(item.price || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order Baru" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><ClipboardList className="h-5 w-5 text-blue-600" /></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Buat Order Baru</h1>
                        <p className="text-sm text-muted-foreground">Isi data order dan item laundry pelanggan</p>
                    </div>
                </div>

                <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); post('/orders'); }} className="space-y-5">
                    {/* Customer & Service */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Informasi Order</span>
                        </div>
                        <CardContent className="pt-4 grid gap-4 sm:grid-cols-2">
                            <Field label="Pelanggan" error={errors.customer_id}>
                                <Select value={data.customer_id} onValueChange={(v: string) => setData('customer_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih Pelanggan" /></SelectTrigger>
                                    <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.display_name}</SelectItem>)}</SelectContent>
                                </Select>
                            </Field>
                            <Field label="Layanan" error={errors.service_id}>
                                <Select value={data.service_id} onValueChange={(v: string) => setData('service_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih Layanan" /></SelectTrigger>
                                    <SelectContent>{services.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name} — {s.unit_type === 'kg' ? fmt(Number(s.price_per_kg)) + '/kg' : fmt(Number(s.price_per_item)) + '/item'}
                                        </SelectItem>
                                    ))}</SelectContent>
                                </Select>
                            </Field>
                            <Field label="Total Berat (kg)">
                                <Input type="number" step="0.1" value={data.total_weight} onChange={(e) => setData('total_weight', e.target.value)} placeholder="0.0" />
                            </Field>
                            <Field label="Total Items">
                                <Input type="number" value={data.total_items} onChange={(e) => setData('total_items', e.target.value)} placeholder="0" />
                            </Field>
                            <Field label="Tipe Pickup">
                                <Select value={data.pickup_type} onValueChange={(v: string) => setData('pickup_type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="drop_off">Antar Sendiri</SelectItem>
                                        <SelectItem value="pickup">Dijemput Kurir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Tipe Delivery">
                                <Select value={data.delivery_type} onValueChange={(v: string) => setData('delivery_type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self_pickup">Ambil Sendiri</SelectItem>
                                        <SelectItem value="delivery">Diantar Kurir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label className="text-xs font-medium text-muted-foreground">Catatan</Label>
                                <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Catatan tambahan..." rows={2} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shirt className="h-4 w-4 text-violet-500" />
                                <span className="font-semibold text-sm">Item Laundry</span>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah
                            </Button>
                        </div>
                        <CardContent className="pt-4 space-y-4">
                            {data.items.map((item, idx) => (
                                <div key={idx} className="relative rounded-lg border p-4">
                                    <div className="grid gap-3 sm:grid-cols-5 items-end">
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <Label className="text-xs font-medium text-muted-foreground">Nama Item</Label>
                                            <Input value={item.item_name} onChange={(e) => updateItem(idx, 'item_name', e.target.value)} placeholder="Kemeja, Celana, dll" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-muted-foreground">Qty</Label>
                                            <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-muted-foreground">Harga Satuan</Label>
                                            <Input type="number" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} placeholder="0" />
                                        </div>
                                        <div className="flex justify-end sm:justify-center pb-1">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)} disabled={data.items.length === 1} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {Number(item.price) > 0 && item.quantity > 0 && (
                                        <p className="text-xs text-muted-foreground mt-2 text-right">
                                            Subtotal: <span className="font-semibold text-foreground tabular-nums">{fmt(item.quantity * Number(item.price))}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end pt-2 border-t">
                                <div className="text-right">
                                    <p className="text-xs font-medium text-muted-foreground">Total Subtotal</p>
                                    <p className="text-2xl font-bold tabular-nums">{fmt(totalSubtotal)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                            {processing ? 'Menyimpan...' : 'Buat Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
