<?php

namespace App\Filament\Resources;

use App\Models\ContactUs;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Tables\Table;
use App\Filament\Resources\ContactUsResource\Pages;

class ContactUsResource extends Resource
{
    protected static ?string $model = ContactUs::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $label = 'Съобщение';
    protected static ?string $pluralLabel = 'Съобщения';

    protected static ?string $navigationGroup = 'Съдържание';
    protected static ?string $navigationLabel = 'Съобщения';
    protected static ?int $navigationSort = 0;

    public static function getNavigationBadge(): ?string
    {
        $modelInstance = static::getModel();
        return $modelInstance::where('status', 'необработен')->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Име')
                    ->required()
                    ->maxLength(191),
                Forms\Components\TextInput::make('email')
                    ->label('Имейл')
                    ->email()
                    ->required()
                    ->maxLength(191),
                Forms\Components\TextInput::make('phone')
                    ->label('Телефон')
                    ->tel()
                    ->maxLength(191),
                Forms\Components\Textarea::make('subject')
                    ->label('Съобщение')
                    ->required()
                    ->maxLength(5000),
                Forms\Components\Select::make('status')
                    ->label('Статус')
                    ->options([
                        'обработен' => 'обработен',
                        'необработен' => 'необработен',
                    ])
                    ->default('new')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Име')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Имейл')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Телефон'),
                Tables\Columns\TextColumn::make('subject')
                    ->label('Съобщение')
                    ->limit(50),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Статус')
                    ->colors([
                        'secondary' => 'new',
                        'success' => 'processed',
                        'warning' => 'archived',
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Дата')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Филтриране по статус')
                    ->options([
                        'new' => 'Ново',
                        'обработен' => 'обработен',
                        'необработен' => 'необработен',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactUs::route('/'),
            'create' => Pages\CreateContactUs::route('/create'),
            'edit' => Pages\EditContactUs::route('/{record}/edit'),
        ];
    }

}
