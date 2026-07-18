<?php

namespace App\Filament\Resources\SupplierResource\Pages;

use Filament\Actions\DeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Resources\Pages\EditRecord;
use App\Filament\Resources\SupplierResource;

use Filament\Actions;

class EditSupplier extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = SupplierResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }
}
