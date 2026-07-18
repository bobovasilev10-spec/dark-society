<?php

namespace App\Filament\Resources\SubscriptionDataResource\Pages;

use App\Filament\Resources\SubscriptionDataResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSubscriptionData extends EditRecord
{
    use EditRecord\Concerns\Translatable;
    protected static string $resource = SubscriptionDataResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }
}
