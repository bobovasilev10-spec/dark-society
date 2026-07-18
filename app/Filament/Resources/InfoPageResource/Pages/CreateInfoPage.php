<?php

namespace App\Filament\Resources\InfoPageResource\Pages;

use App\Filament\Resources\InfoPageResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateInfoPage extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;

    protected static string $resource = InfoPageResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
