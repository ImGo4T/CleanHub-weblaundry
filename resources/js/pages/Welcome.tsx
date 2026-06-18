import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Droplets, ShieldCheck, Clock, Truck, Star } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="CleanHub — Solusi Laundry Modern" />
            <div className="min-h-screen bg-white text-gray-900">
                {/* Header */}
                <header className="border-b">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-7 w-7 text-blue-600" />
                            <span className="text-xl font-bold">CleanHub</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href="/dashboard" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="bg-gradient-to-br from-blue-50 to-white py-24">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
                            <Star className="h-4 w-4 fill-blue-600" />
                            Terpercaya sejak 2024
                        </div>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                            Laundry Bersih,<br />
                            <span className="text-blue-600">Hidup Lebih Mudah.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                            CleanHub mengelola laundry Anda dengan profesional — dari cuci biasa hingga dry cleaning.
                            Pesan, lacak, dan bayar semuanya dalam satu platform.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Link href="/register" className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                                Mulai Sekarang
                            </Link>
                            <a href="#layanan" className="rounded-lg border border-gray-200 px-8 py-3 font-medium text-gray-700 hover:bg-gray-50 transition">
                                Lihat Layanan
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="layanan" className="py-20">
                    <div className="mx-auto max-w-6xl px-6">
                        <h2 className="text-center text-3xl font-bold">Kenapa Pilih CleanHub?</h2>
                        <p className="mt-3 text-center text-gray-500">Kami menggabungkan teknologi dan kualitas layanan terbaik.</p>

                        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: Droplets, title: 'Cuci Profesional', desc: 'Deterjen premium & mesin modern untuk hasil terbaik setiap cucian.' },
                                { icon: Clock, title: 'Tepat Waktu', desc: 'Estimasi waktu jelas. Kami selesaikan sesuai janji, tanpa keterlambatan.' },
                                { icon: Truck, title: 'Antar Jemput', desc: 'Layanan pickup & delivery ke lokasi Anda. Hemat waktu, tanpa repot.' },
                                { icon: ShieldCheck, title: 'Garansi Bersih', desc: 'Tidak puas? Kami cuci ulang gratis sampai hasil sempurna.' },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                                        <Icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold">{title}</h3>
                                    <p className="mt-2 text-sm text-gray-500">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Preview */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="text-3xl font-bold">Harga Transparan</h2>
                        <p className="mt-3 text-gray-500">Mulai dari Rp 7.000/kg. Tanpa biaya tersembunyi.</p>

                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {[
                                { name: 'Cuci Basah', price: '7.000', unit: '/kg', highlight: false },
                                { name: 'Cuci + Setrika', price: '15.000', unit: '/kg', highlight: true },
                                { name: 'Dry Clean', price: '25.000', unit: '/item', highlight: false },
                            ].map(({ name, price, unit, highlight }) => (
                                <div
                                    key={name}
                                    className={`rounded-2xl p-6 ${highlight ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-gray-100'}`}
                                >
                                    <p className={`text-sm font-medium ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{name}</p>
                                    <p className="mt-2 text-3xl font-bold">Rp {price}</p>
                                    <p className={`text-sm ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{unit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="text-3xl font-bold">Siap Coba CleanHub?</h2>
                        <p className="mt-3 text-gray-500">Daftar gratis dan nikmati kemudahan laundry modern hari ini.</p>
                        <div className="mt-8">
                            <Link href="/register" className="rounded-lg bg-blue-600 px-10 py-3 font-medium text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                                Daftar Gratis
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t py-8">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            <span>CleanHub © {new Date().getFullYear()}</span>
                        </div>
                        <span>Dibuat dengan ❤️ untuk kebersihan Anda</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
