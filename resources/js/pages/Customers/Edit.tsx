import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Customer } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Crown, Mail, MapPin, Phone, Save, Star, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

export default function CustomersEdit({ customer }: { customer: Customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.user?.name || '',
        email: customer.user?.email || '',
        phone: customer.user?.phone || '',
        address: customer.address || '',
        membership_tier: customer.membership_tier as 'bronze' | 'silver' | 'gold',
        points: String(customer.points),
    });

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: customer.user?.name || 'Edit', href: `/customers/${customer.id}` }, { title: 'Edit', href: `/customers/${customer.id}/edit` }]}>
            <Head title={`Edit: ${customer.user?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><User className="h-5 w-5 text-blue-600" /></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Edit Pelanggan</h1>
                        <p className="text-sm text-muted-foreground">Perbarui data pelanggan</p>
                    </div>
                </div>

                <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); put(`/customers/${customer.id}`); }} className="space-y-5">
                    <Card className="overflow-hidden">
                        <div className="border-b px-5 py-3.5 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Data Pelanggan</span>
                        </div>
                        <CardContent className="pt-4 grid gap-4">
                            <Field label="Nama Lengkap" error={errors.name} icon={<User className="h-4 w-4" />}>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama lengkap" />
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Email" error={errors.email} icon={<Mail className="h-4 w-4" />}>
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@contoh.com" />
                                </Field>
                                <Field label="No. Telepon" error={errors.phone} icon={<Phone className="h-4 w-4" />}>
                                    <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="08xxxxxxxxxx" />
                                </Field>
                            </div>
                            <Field label="Alamat" error={errors.address} icon={<MapPin className="h-4 w-4" />}>
                                <Textarea value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Alamat lengkap" rows={2} />
                            </Field>

                            {/* Membership & Points */}
                            <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Crown className="h-3.5 w-3.5" /> Membership & Loyalty
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Membership Tier" error={errors.membership_tier} icon={<Crown className="h-4 w-4" />}>
                                        <Select value={data.membership_tier} onValueChange={(v: string) => setData('membership_tier', v as 'bronze' | 'silver' | 'gold')}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bronze">Bronze (0% diskon)</SelectItem>
                                                <SelectItem value="silver">Silver (5% diskon)</SelectItem>
                                                <SelectItem value="gold">Gold (10% diskon)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field label="Poin" error={errors.points} icon={<Star className="h-4 w-4" />}>
                                        <Input type="number" value={data.points} onChange={(e) => setData('points', e.target.value)} min="0" />
                                    </Field>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Poin bertambah otomatis saat order selesai. Membership mempengaruhi diskon & multiplier poin.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                            <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Update Pelanggan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, error, icon, children }: { label: string; error?: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{icon}{label}</Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
