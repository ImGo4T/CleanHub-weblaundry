import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Customer, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Crown, Edit, Mail, Phone, Plus, Search, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

const tierBadge: Record<string, string> = {
    bronze: 'bg-amber-50 text-amber-700 border-amber-200',
    silver: 'bg-gray-50 text-gray-600 border-gray-200',
    gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export default function CustomersIndex({ customers, filters }: { customers: PaginatedData<Customer>; filters: { search?: string } }) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        router.get('/customers', { search: fd.get('search') as string }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" /> Daftar Pelanggan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{customers.total} total pelanggan</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/customers/create"><Plus className="mr-2 h-4 w-4" />Tambah Pelanggan</Link>
                    </Button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input name="search" placeholder="Cari nama, email, atau telepon..." defaultValue={filters.search} className="pl-10" />
                    </div>
                </form>

                {/* Desktop Table */}
                <Card className="hidden md:block overflow-hidden">
                    <CardContent className="p-0">
                        {customers.data.length === 0 ? <EmptyState /> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/40">
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telepon</th>
                                            <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member</th>
                                            <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {customers.data.map((c) => (
                                            <tr key={c.id} className="transition-colors hover:bg-muted/30">
                                                <td className="py-3.5 px-5">
                                                    <Link href={`/customers/${c.id}`} className="font-semibold text-blue-600 hover:underline">{c.user?.name}</Link>
                                                </td>
                                                <td className="py-3.5 px-5 text-muted-foreground">{c.user?.email}</td>
                                                <td className="py-3.5 px-5 text-muted-foreground">{c.user?.phone || '-'}</td>
                                                <td className="py-3.5 px-5">
                                                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${tierBadge[c.membership_tier] || ''}`}>
                                                        {c.membership_tier === 'gold' && <Crown className="h-3 w-3" />}
                                                        {c.membership_tier}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-5 text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/customers/${c.id}/edit`}><Edit className="h-4 w-4" /></Link>
                                                    </Button>
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
                    {customers.data.length === 0 ? <EmptyState /> : customers.data.map((c) => (
                        <Card key={c.id}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <Link href={`/customers/${c.id}`} className="font-semibold text-blue-600">{c.user?.name}</Link>
                                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${tierBadge[c.membership_tier] || ''}`}>
                                        {c.membership_tier}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{c.user?.email}</span></div>
                                    <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{c.user?.phone || '-'}</div>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2.5">
                                    <span className="text-xs text-muted-foreground">Poin: <span className="font-bold tabular-nums">{c.points}</span></span>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/customers/${c.id}/edit`}><Edit className="h-3.5 w-3.5" /></Link>
                                    </Button>
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
            <div className="rounded-full bg-muted p-4 mb-4"><Users className="h-8 w-8 text-muted-foreground" /></div>
            <p className="font-medium text-muted-foreground">Belum ada pelanggan</p>
            <Link href="/customers/create" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                <Plus className="h-3 w-3" /> Tambah Pelanggan Pertama
            </Link>
        </div>
    );
}
