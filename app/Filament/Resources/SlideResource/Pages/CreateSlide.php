<?php

namespace App\Filament\Resources\SlideResource\Pages;

use App\Filament\Resources\SlideResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateSlide extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = SlideResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
