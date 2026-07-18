<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClientResource\Pages;
use App\Filament\Resources\ClientResource\RelationManagers;
use App\Models\Client;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class ClientResource extends Resource
{
    use Translatable;
    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = Client::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $label = 'Клиент';
    protected static ?string $pluralLabel = 'Клиенти';

    protected static ?string $navigationGroup = 'Съдържание';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?int $navigationSort = 0;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Име')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('description')
                    ->label('Съдържание')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image_before')
                    ->label('Изображение преди')
                    ->image()
                    ->required(),
                Forms\Components\FileUpload::make('image_after')
                    ->label('Изображение след')
                    ->image()
                    ->required(),
                Forms\Components\TextInput::make('weight_loss')
                    ->label('Загуба на тегло (кг)')
                    ->numeric()
                    ->maxLength(255),
                Forms\Components\TextInput::make('weight_gain')
                    ->label('увеличаване на мускулната маса (кг)')
                    ->numeric()
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Име'),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->html()
                    ->label('Съдържание'),
                Tables\Columns\ImageColumn::make('image_before')
                    ->label('Изображение преди'),
                Tables\Columns\ImageColumn::make('image_after')
                    ->label('Изображение след'),
                Tables\Columns\TextColumn::make('weight_loss')
                    ->label('Загуба на тегло (кг)'),
                Tables\Columns\TextColumn::make('weight_gain')
                    ->label('увеличаване на мускулната маса (кг)'),
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
            'index' => Pages\ListClients::route('/'),
            'create' => Pages\CreateClient::route('/create'),
            'edit' => Pages\EditClient::route('/{record}/edit'),
        ];
    }
}
