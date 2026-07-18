<?php

namespace App\Filament\Resources\MedicalPersonResource\Pages;

use App\Filament\Resources\MedicalPersonResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMedicalPerson extends EditRecord
{
    use EditRecord\Concerns\Translatable;
    protected static string $resource = MedicalPersonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }
}
