<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Diterima = 'diterima';
    case Dicuci = 'dicuci';
    case Disetrika = 'disetrika';
    case Siap = 'siap';
    case Diambil = 'diambil';
    case Selesai = 'selesai';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Diterima => 'Diterima',
            self::Dicuci => 'Sedang Dicuci',
            self::Disetrika => 'Sedang Disetrika',
            self::Siap => 'Siap Diambil',
            self::Diambil => 'Sudah Diambil / Diantar',
            self::Selesai => 'Selesai',
            self::Cancelled => 'Dibatalkan',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Diterima => 'blue',
            self::Dicuci => 'yellow',
            self::Disetrika => 'orange',
            self::Siap => 'green',
            self::Diambil => 'teal',
            self::Selesai => 'emerald',
            self::Cancelled => 'red',
        };
    }

    public function next(): ?self
    {
        return match ($this) {
            self::Diterima => self::Dicuci,
            self::Dicuci => self::Disetrika,
            self::Disetrika => self::Siap,
            self::Siap => self::Diambil,
            self::Diambil => self::Selesai,
            self::Selesai, self::Cancelled => null,
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Selesai, self::Cancelled]);
    }

    public function isActive(): bool
    {
        return !$this->isFinal();
    }
}
