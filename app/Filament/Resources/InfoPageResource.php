<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InfoPageResource\Pages;
use App\Filament\Resources\InfoPageResource\RelationManagers;
use App\Models\InfoPage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class InfoPageResource extends Resource
{
    use Translatable;

    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = InfoPage::class;
    protected static ?string $label = 'Информационна страница';
    protected static ?string $pluralLabel = 'Информационни страници';

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationGroup = 'Съдържание';
    protected static ?int $navigationSort = 0;


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->label('Заглавие')
                    ->maxLength(255)
                    ->required(),
                Forms\Components\TextInput::make('slug')
                    ->label('Линк')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('content')
                    ->label('Съдържание')
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_active')
                    ->label('Активно')
                    ->required(),
                Forms\Components\Toggle::make('is_top')
                    ->label('Показва се в горната част на страницата')
                    ->required(),
                Forms\Components\Toggle::make('is_bottom')
                    ->label('Показва се в долната част на страницата')
                    ->required(),
                Forms\Components\Toggle::make('is_required_for_order')
                    ->label('Задължително за поръчка')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Заглавие')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Линк')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Активно')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_top')
                    ->label('Показва се в горната част на страницата')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_bottom')
                    ->label('Показва се в долната част на страницата')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_required_for_order')
                    ->label('Задължително за поръчка')
                    ->boolean(),
            ])
            ->defaultSort('id', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
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
            'index' => Pages\ListInfoPages::route('/'),
            'create' => Pages\CreateInfoPage::route('/create'),
            'edit' => Pages\EditInfoPage::route('/{record}/edit'),
        ];
    }
}
