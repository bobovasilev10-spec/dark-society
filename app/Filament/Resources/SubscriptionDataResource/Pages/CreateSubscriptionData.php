<?php

namespace App\Filament\Resources\SubscriptionDataResource\Pages;

use App\Filament\Resources\SubscriptionDataResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateSubscriptionData extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;

    protected static string $resource = SubscriptionDataResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
