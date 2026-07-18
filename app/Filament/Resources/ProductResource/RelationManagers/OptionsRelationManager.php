<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use App\Models\Option;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OptionsRelationManager extends RelationManager
{
    protected static string $relationship = 'options';

    protected static ?string $label = 'Опция';
    protected static ?string $pluralLabel = 'Опции';
    protected static ?string $title = 'Добави Опция';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('option_id')
                    ->label('Опция')
                    ->relationship('option', 'name')
                    ->options(Option::all()->pluck('name', 'id')->toArray())
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('qty')
                    ->required()
                    ->label("Количество")
                    ->numeric()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->label("Стойност")
                    ->maxLength(255),
                // Forms\Components\Toggle::make('in_stock')
                //     ->label('В наличност')
                //     ->default(true)
                //     ->required(),

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('option.name')
                    ->label('Опция'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Стоиност'),
                Tables\Columns\TextInputColumn::make('qty')
                    ->label('Количество'),

            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
