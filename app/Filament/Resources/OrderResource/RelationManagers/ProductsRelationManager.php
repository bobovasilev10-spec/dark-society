<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use App\Models\Option;
use App\Models\Product;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Forms\Form;
use App\Models\OrderItem;
use Filament\Tables\Table;
use App\Models\ProductOption;
use Filament\Forms\Components\Repeater;
use Illuminate\Support\HtmlString;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;

class ProductsRelationManager extends RelationManager
{
    protected static string $relationship = 'products';

    protected static ?string $pluralLabel = 'Продукти';
    protected static ?string $label = 'Продукт';
    protected static ?string $title = 'Продукти';

    public static function getBadge(Model $ownerRecord, string $pageClass): ?string
    {
        $count = OrderItem::where('order_id', $ownerRecord->id)->whereNotNull('product_id')->count();
        // dd($ownerRecord->id);
        return $count;
    }
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->label('Продукт')
                    ->searchable()
                    ->columnSpanFull()
                    ->reactive()
                    ->live(true)
                    ->afterStateUpdated(
                        function (Set $set, Get $get) {
                            self::calculatePrice($set, $get);
                        }
                    )
                    ->options(
                        Product::query()->pluck('name', 'id')
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
                Forms\Components\Repeater::make('product_options')
                    ->label('Опция размер')
                    ->live()
                    ->visible(function(Set $set, Get $get){
                        if (!$get('product_id')) {
                            return false;
                        }
                        $product = Product::query()->find($get('product_id'));
                        return $product->options->count() > 0;
                    })
                    ->schema([
                        Forms\Components\Select::make('option_id')
                            ->label('Опция')
                            ->options(Option::all()->pluck('name', 'id')->toArray())
                            ->default(1)
                            ->afterStateUpdated(fn(Set $set) => $set('value', null))
                            ->required(),
                        Forms\Components\Select::make('value')
                            ->options(function (Set $set, Get $get) {
                                $product_id = $get('../../product_id');
                                $product = Product::query()->find($product_id);
                                if ($product) {
                                    return  $product->options->pluck('name', 'id');
                                }
                                return [];
                            })
                            ->preload()
                            ->reactive()
                            ->label('Стойност')
                            ->required(),
                    ])
                    ->columns(2)
                    ->maxItems(1)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        $query = $this->getRelationship()->getQuery()->whereNotNull('product_id');

        return $table
            ->recordTitleAttribute('title')
            ->query($query)
            ->columns([
                Tables\Columns\ImageColumn::make('product.image')
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
                    ->description(
                        function ($record) {
                            return isset($record->product_options[0]['value']) ? 'Размер: ' . $record->product_options[0]['value'] : 'Няма опция';
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
                Tables\Actions\CreateAction::make()
                    ->label('Добави продукт')
                    ->using(function (array $data, string $model, $livewire) {

                        $parent = $livewire->ownerRecord;
                        $data['order_id'] = $parent->id;

                        $orderItem = $model::create($data);

                        return $orderItem;
                    }),

            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                // ->using(function (array $data) {
                //     if (isset($data['product_options']) && is_array($data['product_options'])) {
                //         $data['product_options'] = json_encode($data['product_options']);
                //     }
                //     return $data;
                // }),
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
        $product = Product::query()->find($get('product_id'));
        $set('name', $product->name);
        $set('price', $product->price);
    }
}
