import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Service } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, Edit, Package, Plus, Sparkles, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Services', href: '/services' },
];

const fmt = (amount: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));

const unitLabels: Record<string, string> = { kg: 'Per Kg', item: 'Per Item', both: 'Kg / Item' };

export default function ServicesIndex({ services }: { services: Service[] }) {
    const handleDelete = (id: number) => { if (confirm('Yakin ingin menghapus layanan ini?')) router.delete(`/services/${id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-violet-500" /> Daftar Layanan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{services.length} layanan tersedia</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/services/create"><Plus className="mr-2 h-4 w-4" />Tambah Layanan</Link>
                    </Button>
                </div>

                {/* Desktop Table */}
                <Card className="hidden md:block overflow-hidden">
                    <CardContent className="p-0">
                        {services.length === 0 ? <EmptyState /> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layanan</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Harga/kg</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Harga/item</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipe</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Durasi</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {services.map((s) => (
                                            <tr key={s.id} className="transition-colors hover:bg-muted/30">
                                                <td className="py-3.5 px-5 font-semibold">{s.name}</td>
                                                <td className="py-3.5 px-5 tabular-nums">{s.unit_type !== 'item' ? fmt(s.price_per_kg) : <span className="text-muted-foreground">-</span>}</td>
                                                <td className="py-3.5 px-5 tabular-nums">{s.unit_type !== 'kg' ? fmt(s.price_per_item) : <span className="text-muted-foreground">-</span>}</td>
                                                <td className="py-3.5 px-5 text-muted-foreground">{unitLabels[s.unit_type] || s.unit_type}</td>
                                                <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap"><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{s.duration_hours} jam</span></td>
                                                <td className="py-3.5 px-5">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-5 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="sm" asChild><Link href={`/services/${s.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-3 md:hidden">
                    {services.length === 0 ? <EmptyState /> : services.map((s) => (
                        <Card key={s.id}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">{s.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{unitLabels[s.unit_type]} &middot; {s.duration_hours} jam</p>
                                    </div>
                                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {s.unit_type !== 'item' && <div><p className="text-xs text-muted-foreground">Per Kg</p><p className="font-semibold tabular-nums">{fmt(s.price_per_kg)}</p></div>}
                                    {s.unit_type !== 'kg' && <div><p className="text-xs text-muted-foreground">Per Item</p><p className="font-semibold tabular-nums">{fmt(s.price_per_item)}</p></div>}
                                </div>
                                <div className="flex gap-2 border-t pt-3">
                                    <Button variant="outline" size="sm" asChild className="flex-1"><Link href={`/services/${s.id}/edit`}><Edit className="mr-1.5 h-3.5 w-3.5" />Edit</Link></Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4"><Package className="h-8 w-8 text-muted-foreground" /></div>
            <p className="font-medium text-muted-foreground">Belum ada layanan</p>
            <Link href="/services/create" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                <Plus className="h-3 w-3" /> Tambah Layanan Pertama
            </Link>
        </div>
    );
}
