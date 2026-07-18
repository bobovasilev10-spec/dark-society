<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MedicalPersonResource\Pages;
use App\Filament\Resources\MedicalPersonResource\RelationManagers;
use App\Models\MedicalPerson;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\Concerns\Translatable;

class MedicalPersonResource extends Resource
{
    use Translatable;
    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = MedicalPerson::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $label = 'Медицински специалисти';
    protected static ?string $pluralLabel = 'Медицински специалисти';

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
                Forms\Components\TextInput::make('specialization')
                    ->label('Специализация')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('content')
                    ->label('Съдържание')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image')
                    ->label('Изображение')
                    ->image()
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Изображение'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Име')
                    ->sortable(),
                Tables\Columns\TextColumn::make('specialization')
                    ->label('Специализация')
                    ->sortable(),
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
            'index' => Pages\ListMedicalPeople::route('/'),
            'create' => Pages\CreateMedicalPerson::route('/create'),
            'edit' => Pages\EditMedicalPerson::route('/{record}/edit'),
        ];
    }
}
