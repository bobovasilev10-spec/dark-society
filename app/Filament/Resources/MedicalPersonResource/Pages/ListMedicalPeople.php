<?php

namespace App\Filament\Resources\MedicalPersonResource\Pages;

use App\Filament\Resources\MedicalPersonResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMedicalPeople extends ListRecords
{
    use ListRecords\Concerns\Translatable;
    protected static string $resource = MedicalPersonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
