<?php

namespace App\Filament\Resources\CategoryResource\Pages;

use App\Filament\Resources\CategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Actions;

class EditCategory extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = CategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
            Actions\LocaleSwitcher::make()
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $originalParentId = $this->record->getOriginal('parent_id');

        $newParentId = $data['parent_id'] ?? null;
        if ($originalParentId != $newParentId) {
            $childs = $this->record->children;
            foreach ($childs as $child) {
                $child->parent_id = $newParentId;
                $child->save();
            }
        }
        return $data;
    }
}
