<?php

namespace App\Filament\Resources\InfoPageResource\Pages;

use App\Filament\Resources\InfoPageResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInfoPages extends ListRecords
{
    use ListRecords\Concerns\Translatable;
    protected static string $resource = InfoPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }
}
