<?php

namespace App\Http\Requests\Orders;

use App\Enums\DeliveryType;
use App\Enums\PickupType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'service_id' => ['required', 'exists:services,id'],
            'total_weight' => ['nullable', 'numeric', 'min:0'],
            'total_items' => ['nullable', 'integer', 'min:0'],
            'pickup_type' => ['required', Rule::enum(PickupType::class)],
            'delivery_type' => ['required', Rule::enum(DeliveryType::class)],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_name' => ['required', 'string', 'max:150'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.weight' => ['nullable', 'numeric', 'min:0'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
