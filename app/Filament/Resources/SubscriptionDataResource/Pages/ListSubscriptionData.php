<?php

namespace App\Filament\Resources\SubscriptionDataResource\Pages;

use App\Filament\Resources\SubscriptionDataResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSubscriptionData extends ListRecords
{
    use ListRecords\Concerns\Translatable;
    protected static string $resource = SubscriptionDataResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }
}
