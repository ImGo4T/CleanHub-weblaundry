<?php

use App\Enums\ServiceUnitType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->decimal('price_per_kg', 10, 2)->default(0);
            $table->decimal('price_per_item', 10, 2)->default(0);
            $table->string('unit_type')->default(ServiceUnitType::Kg->value);
            $table->unsignedInteger('duration_hours')->default(24);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
