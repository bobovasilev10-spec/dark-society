<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriptionDataResource\Pages;
use App\Filament\Resources\SubscriptionDataResource\RelationManagers;
use App\Models\SubscriptionData;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class SubscriptionDataResource extends Resource
{
    use Translatable;

    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = SubscriptionData::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $label = 'Допълнителни данни';
    protected static ?string $pluralLabel = 'Допълнителни данни';

    protected static ?string $navigationGroup = 'Абонаменти';
    protected static ?int $navigationSort = 1;
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('key')
                    ->label('KEY')
                    ->unique(SubscriptionData::class, 'key', fn($record) => $record)
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('label')
                    ->label('Стойност')
                    ->hint('Години,Тегло и т.н.')
                    ->required()
                    ->maxLength(255)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('key')
                    ->label('KEY')
                    ->searchable(),
                Tables\Columns\TextColumn::make('label')
                    ->label('Стойност')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereRaw('LOWER(label) LIKE ?', ['%' . strtolower($search) . '%']);
                    }),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubscriptionData::route('/'),
            'create' => Pages\CreateSubscriptionData::route('/create'),
            'edit' => Pages\EditSubscriptionData::route('/{record}/edit'),
        ];
    }
}
