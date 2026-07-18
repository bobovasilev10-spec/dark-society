<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Forms\Form;
use App\Models\OrderItem;
use Filament\Tables\Table;
use App\Models\Subscription;
use App\Models\SubscriptionData;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;

class SubscriptionRelationManager extends RelationManager
{
    protected static string $relationship = 'subscriptions';
    protected static ?string $label = 'Абонамент';
    protected static ?string $pluralLabel = 'Абонаменти';

    protected static ?string $title = 'Абонаменти';
    public static function getBadge(Model $ownerRecord, string $pageClass): ?string
    {
        $count = OrderItem::where('order_id', $ownerRecord->id)->whereNotNull('subscription_id')->count();
        return $count;
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('subscription_id')
                    ->label('Абонамент')
                    ->searchable()
                    ->columnSpanFull()
                    ->reactive()
                    ->afterStateUpdated(
                        function (Set $set, Get $get) {
                            self::calculatePrice($set, $get);
                        }
                    )
                    ->options(
                        Subscription::query()->pluck('name', 'id')
                    ),
                Forms\Components\TextInput::make('name')
                    ->label('Име')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('quantity')
                    ->numeric()
                    ->label('Количество')
                    ->default(1)
                    ->required(),
                Forms\Components\TextInput::make('price')
                    ->numeric()
                    ->label('Цена')
                    ->suffix('лв.')
                    ->required(),
                Forms\Components\Repeater::make('subscription_data')
                    ->label('Данни за абонамент')
                    ->schema(
                        function (Forms\Get $get) {
                            if (!$get('subscription_id')) {
                                return [];
                            }
                            return self::getSchemaForFields($get('subscription_id'));
                        }
                    )
                    ->maxItems(1)
                    ->defaultItems(1)
                    ->deletable(false)
                    ->columns(2)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        $query = $this->getRelationship()->getQuery()->whereNotNull('subscription_id');
        return $table
            ->recordTitleAttribute('name')
            ->query($query)
            ->columns([
                Tables\Columns\ImageColumn::make('subscription.image')
                    ->label('Снимка'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Име')
                    ->sortable(),

                Tables\Columns\TextColumn::make('quantity')
                    ->label('Количество')
                    ->formatStateUsing(
                        function ($record) {
                            return $record->quantity . ' бр.';
                        }
                    )
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->formatStateUsing(
                        function ($record) {
                            return number_format($record->price * $record->quantity, 2, '.') . ' лв.';
                        }
                    )
                    ->description(
                        function ($record) {
                            return 'Ед. цена: ' . number_format($record->price, 2, '.') . ' лв.';
                        }
                    )
                    ->label('Цена')
                    ->sortable(),
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
    private static function calculatePrice(Set $set, Get $get)
    {
        $subscription = Subscription::query()->find($get('subscription_id'));
        $set('name', $subscription->name);
        $set('price', $subscription->price);
    }

    private static function getSchemaForFields($subscription_id)
    {
        $subscription = Subscription::query()->find($subscription_id);
        $schema = [];
        foreach ($subscription->subscription_data as $key) {
            $data_option = SubscriptionData::query()->where('key', $key)->first();
            $schema[] = Forms\Components\TextInput::make($key)
                ->label($data_option->label)
                ->required();
        }
        return $schema;
    }
}
