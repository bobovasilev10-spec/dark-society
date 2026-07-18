<?php

namespace App\Filament\Resources\OptionResource\Pages;

use App\Filament\Resources\OptionResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateOption extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;

    protected static string $resource = OptionResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
