<?php

namespace App\Filament\Resources\MedicalPersonResource\Pages;

use App\Filament\Resources\MedicalPersonResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateMedicalPerson extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = MedicalPersonResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
