import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Service } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, DollarSign, Save, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Services', href: '/services' },
];

export default function ServicesEdit({ service }: { service: Service }) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name,
        description: service.description || '',
        price_per_kg: service.price_per_kg,
        price_per_item: service.price_per_item,
        unit_type: service.unit_type,
        duration_hours: String(service.duration_hours),
        is_active: service.is_active as boolean,
    });

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: 'Edit: ' + service.name, href: `/services/${service.id}/edit` }]}>
            <Head title={`Edit: ${service.name}`} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-violet-50 p-2"><Sparkles className="h-5 w-5 text-violet-600" /></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Edit Layanan</h1>
                        <p className="text-sm text-muted-foreground">Perbarui informasi layanan {service.name}</p>
                    </div>
                </div>

                <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); put(`/services/${service.id}`); }} className="space-y-5">
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-violet-500" />
                            <span className="font-semibold text-sm">Detail Layanan</span>
                        </div>
                        <CardContent className="pt-4 space-y-4">
                            <Field label="Nama Layanan" error={errors.name} required>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </Field>

                            <Field label="Deskripsi" error={errors.description}>
                                <Textarea value={data.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)} rows={3} />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Tipe Unit" error={errors.unit_type} required>
                                    <Select value={data.unit_type} onValueChange={(v) => setData('unit_type', v as 'kg' | 'item' | 'both')}>
                                        <SelectTrigger><SelectValue placeholder="Pilih tipe..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">Per Kilogram</SelectItem>
                                            <SelectItem value="item">Per Item</SelectItem>
                                            <SelectItem value="both">Kg / Item</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Durasi (jam)" error={errors.duration_hours} icon={<Clock className="h-4 w-4" />} required>
                                    <Input type="number" value={data.duration_hours} onChange={(e) => setData('duration_hours', e.target.value)} min="1" />
                                </Field>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Harga per Kg" error={errors.price_per_kg} icon={<DollarSign className="h-4 w-4" />} required>
                                    <Input type="number" value={data.price_per_kg} onChange={(e) => setData('price_per_kg', e.target.value)} min="0" />
                                </Field>
                                <Field label="Harga per Item" error={errors.price_per_item} icon={<DollarSign className="h-4 w-4" />} required>
                                    <Input type="number" value={data.price_per_item} onChange={(e) => setData('price_per_item', e.target.value)} min="0" />
                                </Field>
                            </div>

                            <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                                <input type="checkbox" checked={data.is_active} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                                <div>
                                    <p className="text-sm font-medium">Aktif</p>
                                    <p className="text-xs text-muted-foreground">Layanan tersedia untuk pelanggan</p>
                                </div>
                            </label>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                            <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Update Layanan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, error, icon, required, children }: { label: string; error?: string; icon?: React.ReactNode; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                {icon}{label}{required && <span className="text-red-400">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
