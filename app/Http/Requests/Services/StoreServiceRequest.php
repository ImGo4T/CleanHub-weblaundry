<?php

namespace App\Http\Requests\Services;

use App\Enums\ServiceUnitType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price_per_kg' => ['required', 'numeric', 'min:0'],
            'price_per_item' => ['required', 'numeric', 'min:0'],
            'unit_type' => ['required', Rule::enum(ServiceUnitType::class)],
            'duration_hours' => ['required', 'integer', 'min:1', 'max:720'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
