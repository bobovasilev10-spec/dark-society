<?php

namespace App\Filament\Resources\SubscriptionResource\Pages;

use App\Filament\Resources\SubscriptionResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateSubscription extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;
    protected static string $resource = SubscriptionResource::class;
    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make()

        ];
    }
}
