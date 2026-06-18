import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Crown, Lock, Mail, MapPin, Phone, Save, Star, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
    { title: 'Tambah Pelanggan', href: '/customers/create' },
];

export default function CustomersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', address: '', password: '', password_confirmation: '',
        membership_tier: 'bronze', points: '0',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pelanggan" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2"><User className="h-5 w-5 text-blue-600" /></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Tambah Pelanggan</h1>
                        <p className="text-sm text-muted-foreground">Lengkapi data pelanggan baru</p>
                    </div>
                </div>

                <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); post('/customers'); }} className="space-y-5">
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
                                <Field label="Poin Awal" error={errors.points} icon={<Star className="h-4 w-4" />}>
                                    <Input type="number" value={data.points} onChange={(e) => setData('points', e.target.value)} min="0" />
                                </Field>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Password" error={errors.password} icon={<Lock className="h-4 w-4" />}>
                                    <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Minimal 8 karakter" />
                                </Field>
                                <Field label="Konfirmasi Password" error={errors.password_confirmation} icon={<Lock className="h-4 w-4" />}>
                                    <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="Ulangi password" />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 sm:flex-none">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                            <Save className="mr-2 h-4 w-4" /> {processing ? 'Menyimpan...' : 'Simpan Pelanggan'}
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
