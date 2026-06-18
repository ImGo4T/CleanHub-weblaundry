<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Http\Requests\Payments\StorePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Order $order): Response
    {
        $payments = $order->payments()->latest()->get();

        return Inertia::render('Payments/Index', [
            'order' => $order->load('customer.user'),
            'payments' => $payments,
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        $payment = Payment::create($request->validated());

        // Auto-verify cash payments
        if ($request->method === 'cash') {
            $payment->verify();
        }

        // Update order payment status
        $this->updateOrderPaymentStatus($order);

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function verify(Payment $payment): RedirectResponse
    {
        $payment->verify();

        $this->updateOrderPaymentStatus($payment->order);

        return back()->with('success', 'Pembayaran berhasil diverifikasi.');
    }

    private function updateOrderPaymentStatus(Order $order): void
    {
        $totalPaid = $order->totalPaid();

        if ($totalPaid >= $order->total_price) {
            $order->update(['payment_status' => PaymentStatus::Paid->value]);
        } elseif ($totalPaid > 0) {
            $order->update(['payment_status' => PaymentStatus::Partial->value]);
        }
    }
}
