<?php

namespace App\Filament\Resources;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Models\Subscription;
use Filament\Resources\Resource;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Concerns\Translatable;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\SubscriptionResource\Pages;
use App\Filament\Resources\SubscriptionResource\RelationManagers;
use App\Models\SubscriptionData;

class SubscriptionResource extends Resource
{
    use Translatable;

    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = Subscription::class;

    protected static ?string $label = 'Абонамент';
    protected static ?string $pluralLabel = 'Абонаменти';

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationGroup = 'Абонаменти';
    protected static ?int $navigationSort = -1;


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Заглавие')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state, '-', 'bg')))
                    ->maxLength(255),
                Forms\Components\Select::make('type')
                    ->label('Вид')
                    ->required()
                    ->placeholder('Изберете вид')
                    ->options(Subscription::types()),
                Forms\Components\TextInput::make('slug')
                    ->label('Линк')
                    ->unique(Subscription::class, 'slug', fn($record) => $record)
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('price')
                    ->label('Цена')
                    ->numeric()
                    ->required(),
                Forms\Components\FileUpload::make('image')
                    ->label('Изображение')
                    ->image()
                    ->required(),
                Forms\Components\RichEditor::make('content')
                    ->required()
                    ->label('Съдържание')
                    ->columnSpanFull(),
                Forms\Components\Fieldset::make('subscription_data_required')
                    ->label('Допълнителни данни за поръчка')
                    ->schema([
                        Forms\Components\CheckboxList::make('subscription_data')
                            ->label('Изберете кои данни са задължителни за поръчка на този абонамент.')
                            ->options(
                                SubscriptionData::query()
                                    ->orderBy('label')
                                    ->get()
                                    ->pluck('label', 'key')
                            )
                            ->columns(3)
                            ->bulkToggleable()
                            ->columnSpanFull()
                    ]),
                Forms\Components\Toggle::make('is_active')
                    ->label('Активно')
                    ->required(),
                Forms\Components\Toggle::make('requires_delivery')
                    ->label('Изисква доставка')
                    ->default(false)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Заглавие')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
                    }),
                Tables\Columns\TextColumn::make('price')
                    ->formatStateUsing(function ($record) {
                        $text = $record->price . ' лв.' . '<br>';
                        $text .= Subscription::types()[$record->type];

                        return new HtmlString($text);
                    })
                    ->label('Цена'),
                Tables\Columns\ImageColumn::make('image')
                    ->label('Изображение'),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Активно')
                    ->boolean(),
                Tables\Columns\IconColumn::make('requires_delivery')
                    ->label('Изисква доставка')
                    ->boolean(),
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
            RelationManagers\PricesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubscriptions::route('/'),
            'create' => Pages\CreateSubscription::route('/create'),
            'edit' => Pages\EditSubscription::route('/{record}/edit'),
        ];
    }
}
