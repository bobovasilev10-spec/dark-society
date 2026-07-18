<?php

namespace App\Filament\Resources;

use Closure;
use Filament\Forms;
use App\Models\User;
use Filament\Tables;
use App\Models\Order;
use Filament\Forms\Get;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use App\Services\DeliveryService;
use Illuminate\Support\HtmlString;
use Gdinko\Econt\Models\CarrierEcontCity;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use App\Filament\Resources\OrderResource\Pages;

use Filament\Resources\RelationManagers\HasManyRelationManager;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $label = 'Поръчки';
    protected static ?string $pluralLabel = 'Поръчки';

    protected static ?string $navigationGroup = 'Поръчки';
    protected static ?int $navigationSort = -1;

    public static function getNavigationBadge(): ?string
    {
        $modelInstance = static::getModel();
        return $modelInstance::where('status', 'pending')->orWhere('status', 'processing')->count(); // Count related items
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Fieldset::make('user_data')
                    ->label('Данни за клиента')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Име')
                            ->required()
                            ->maxLength(191)
                            ->columns(2),
                        Forms\Components\TextInput::make('email')
                            ->label('Имейл')
                            ->email()
                            ->required()
                            ->maxLength(191)
                            ->columns(2),
                        Forms\Components\TextInput::make('phone')
                            ->label('Телефон')
                            ->tel()
                            ->required()
                            ->maxLength(191)
                            ->columns(2),
                    ])->columns(3),
                Forms\Components\Select::make('delivery_type')
                    ->label('Тип доставка')
                    ->reactive()
                    ->options([
                        'store_pickup' => 'Изпращане от магазина',
                        'econt_office' => 'Еконт офис',
                        'econt_address' => 'Еконт адрес',
                        'address' => 'Адрес',
                    ])
                    ->default('econt_address')
                    ->required(),
                Forms\Components\Fieldset::make('Данни за доставка')
                    ->reactive()
                    ->schema([
                        Forms\Components\Select::make('econt_city_id')
                            ->label('Еконт град')
                            ->searchable()
                            ->helperText('Въведете поне 2 символа')
                            ->reactive()
                            ->options(
                                function ($record) {
                                    if ($record?->econt_city_id) {
                                        return CarrierEcontCity::query()
                                            ->where('econt_city_id', $record->econt_city_id)
                                            ->get()
                                            ->pluck('name', 'econt_city_id');
                                    }
                                    return [];
                                }
                            )
                            ->getSearchResultsUsing(
                                function (string $search) {
                                    if (strlen($search) < 2) {
                                        return [];
                                    }
                                    return CarrierEcontCity::query()
                                        ->where('name', 'like', "%{$search}%")
                                        ->get()
                                        ->pluck('name', 'econt_city_id');
                                }
                            ),
                        Forms\Components\Select::make('econt_office_id')
                            ->label('Еконт офис')
                            ->searchable()
                            ->reactive()
                            ->options(
                                function ($record, Get $get) {

                                    if ($get('econt_city_id')) {
                                        return CarrierEcontOffice::query()
                                            ->where('econt_city_id', $get('econt_city_id'))
                                            ->get()
                                            ->pluck('name', 'econt_office_id');
                                    }
                                }
                            )
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_office'
                            ),
                        Forms\Components\Select::make('econt_street_id')
                            ->label('Еконт улица')
                            ->searchable()
                            ->reactive()
                            ->options(
                                function (Get $get) {
                                    if ($get('econt_city_id')) {
                                        return CarrierEcontStreet::query()
                                            ->where('econt_city_id', $get('econt_city_id'))
                                            ->get()
                                            ->pluck('name', 'econt_street_id');
                                    }
                                    return [];
                                }
                            )
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_address'
                            ),
                        Forms\Components\TextInput::make('econt_street_number')
                            ->label('Номер на улицата')
                            ->maxLength(191)
                            ->reactive()
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_address'
                            ),
                        Forms\Components\TextInput::make('econt_entrance')
                            ->label('Вход')
                            ->maxLength(191)
                            ->reactive()
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_address'
                            ),
                        Forms\Components\TextInput::make('econt_floor')
                            ->label('Етаж')
                            ->maxLength(191)
                            ->reactive()
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_address'
                            ),
                        Forms\Components\TextInput::make('econt_apartment_number')
                            ->label('Апартамент')
                            ->maxLength(191)
                            ->reactive()
                            ->visible(
                                fn(Get $get) => $get('delivery_type') === 'econt_address'
                            ),
                    ])
                    ->visible(
                        function (Get $get) {
                            return in_array($get('delivery_type'), ['econt_office', 'econt_address']);
                        }
                    ),
                Forms\Components\RichEditor::make('additional_info')
                    ->label('Допълнителна информация')
                    ->columnSpanFull()
                    ->maxLength(65535),

                Forms\Components\Toggle::make('invoice')
                    ->label('Фактура')
                    ->reactive()
                    ->hint('Клиентът желае ли фактура?')
                    ->columnSpanFull()
                    ->default(false)
                    ->required(),
                Forms\Components\Fieldset::make('invoice_data')
                    ->label('Данни за фактурата')
                    ->visible(
                        function ($get) {
                            return $get('invoice');
                        }
                    )
                    ->schema([
                        // company_vat, company_name, company_address, company_mol
                        Forms\Components\TextInput::make('invoice_data.company_vat')
                            ->label('Булстат')
                            ->reactive()
                            ->maxLength(191)
                            ->columns(2),
                        Forms\Components\TextInput::make('invoice_data.company_name')
                            ->label('Фирма')
                            ->maxLength(191)
                            ->columns(2),
                        Forms\Components\TextInput::make('invoice_data.company_address')
                            ->label('Адрес')
                            ->maxLength(191)
                            ->columns(2),
                        Forms\Components\TextInput::make('invoice_data.company_mol')
                            ->label('МОЛ')
                            ->maxLength(191)
                            ->columns(2),
                    ]),
                Forms\Components\TextInput::make('total_price')
                    ->label('Обща сума')
                    ->numeric()
                    ->helperText('Общата сума ще се пресметне автоматично при промяна на артикулите.')
                    ->default(0)
                    ->reactive()
                    ->live()
                    ->hint('Оставете 0 при нова поръчка.')
                    ->required(),
                Forms\Components\Select::make('payment_status')
                    ->label('Статус на плащане')
                    ->options([
                        'paid' => 'Платено',
                        'pending' => 'Изчакващо',
                        'failed' => 'Неуспешно',
                        'cancelled' => 'Отказано',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('delivery_fee')
                    ->label('Цена на доставката')
                    ->default(0)
                    ->maxLength(191),
                Forms\Components\Select::make('delivery_status')
                    ->required()
                    ->label('Статус на доставката')
                    // pending, sent, waiting, completed, cancelled
                    ->options(
                        function () {
                            $statuses = Order::getDeliveryStatuses();

                            return $statuses;
                        }
                    ),

                Forms\Components\Select::make('status')
                    ->label('Статус на поръчката')
                    ->required()
                    // pending, processing, completed, cancelled
                    ->options(
                        Order::getStatuses()
                    ),
                Forms\Components\KeyValue::make('coupon_details')
                    ->label('Приложен купон')
                    ->columnSpanFull()
                    ->visible(
                        function ($record) {
                            return $record && $record->coupon_id ? true : false;
                        }
                    )
                    ->extraAttributes([
                        'class' => 'bg-white',
                    ])
                    ->disabled(),
            ])->columns(4);
    }
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Дата')
                    ->dateTime('d.m.Y H:i')
                    ->description(
                        function (Order $record) {
                            return $record->created_at->diffForHumans();
                        }
                    )
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Име')
                    ->description(
                        function ($record) {
                            $text = $record->email . '<br>';
                            $text .= $record->phone;

                            return new HtmlString($text);
                        }
                    ),
                Tables\Columns\TextColumn::make('delivery_type')
                    ->label('Тип доставка')
                    ->formatStateUsing(
                        function ($record) {
                            switch ($record->delivery_type) {
                                case 'econt_office':
                                    return 'До офис на Еконт';
                                case 'econt_address':
                                    return 'До адрес [Еконт]';
                                case 'store_pickup':
                                    return 'Изпращане от магазина';
                            }
                        }
                    )
                    ->description(
                        function ($record) {
                            switch ($record->delivery_type) {
                                case 'econt_office':
                                    $office = CarrierEcontOffice::query()
                                        ->where('econt_office_id', $record->econt_office_id)
                                        ->first();
                                    $text = 'Офис: ' . $office?->name . ' ' . '<br>Пощенски код: ' . $office?->hub_code;
                                    return new HtmlString($text);
                                case 'econt_address':
                                    $city = CarrierEcontCity::query()
                                        ->where('econt_city_id', $record->econt_city_id)
                                        ->first();
                                    $street = CarrierEcontStreet::query()
                                        ->where('econt_street_id', $record->econt_street_id)
                                        ->first();
                                    if ($city && $street) {
                                        $text = 'Град: ' . $city->name . '<br>Адрес: ' . $street->name . ' ' . $record->econt_street_number . ' ' . $record->econt_entrance . ' ' . $record->econt_floor . ' ' . $record->econt_apartment_number;
                                        return new HtmlString($text);
                                    } else {
                                        return 'Адрес: ' . $record->econt_street_number;
                                    }
                                case 'store_pickup':
                                    return 'Изпращане от магазина';
                            }
                        }
                    ),
                // Tables\Columns\TextColumn::make('products')
                //     ->label('Продукти')
                //     ->words(20)
                //     ->formatStateUsing(
                //         function (Order $record) {
                //             $html = '<ul class="list-none text-sm text-slate-500">';
                //             foreach ($record->products as $product) {
                //                 $html .= '<li><span class="text-slate-700">- ' . $product->product->name . '</span><br>';
                //                 $html .= $product->quantity . ' x ' . $product->price . ' = <b>' . number_format($product->price * $product->quantity, 2) . 'лв</b></li>';
                //             }
                //             $html .= '</ul>';

                //             return new HtmlString($html);
                //         }
                //     ),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Сума')
                    ->numeric()
                    ->description(
                        function (Order $record) {
                            return "От която доставка: " . number_format($record->delivery_fee, 2) . 'лв';
                        }
                    )
                    ->suffix('лв')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Плащане')
                    ->color(
                        function ($record) {
                            $color = match ($record->payment_status) {
                                'paid' => 'success',
                                'pending' => 'warning',
                                'failed', 'cancelled' => 'danger',
                                default => 'secondary',
                            };

                            return $color;
                        }
                    )
                    ->formatStateUsing(
                        function ($record) {
                            $status = match ($record->payment_status) {
                                'paid' => 'Платено',
                                'pending' => 'Изчакващо',
                                'failed' => 'Неуспешно',
                                'cancelled' => 'Отказано',
                                default => 'Неизвестно',
                            };
                            $payment_method = match ($record->payment_method) {
                                'at_delivery' => 'При получаване',
                                'online_pos' => 'Плащане с карта',
                                default => 'Неизвестно',
                            };
                            $html = '<div>';
                            $html .= '<span class="badge badge-' . $status . '">' . $status . '</span>' . '<br>';
                            $html .= '<span class="badge badge-' . $status . '">' . $payment_method . '</span>';

                            $html .= '</div>';

                            return new HtmlString($html);
                        }
                    )
                    ->searchable(),
                Tables\Columns\SelectColumn::make('status')
                    ->label('Статус')
                    ->options(Order::getStatuses())
                    ->selectablePlaceholder(false)
                    ->searchable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('Потребител')
                    ->searchable()
                    ->columnSpan(2)
                    ->options(
                        User::all()->pluck('name', 'id')->toArray()
                    ),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Статус')
                    ->columnSpan(2)
                    ->multiple()
                    ->options(Order::getStatuses()),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->label('Вид плащане')
                    ->columnSpan(1)
                    ->multiple()
                    ->options([
                        'at_delivery' => 'При получаване',
                        'online_pos' => 'Плащане с карта',
                    ])
            ])
            ->filtersLayout(Tables\Enums\FiltersLayout::AboveContent)
            ->actions([
                Tables\Actions\EditAction::make(),

            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            // ProductsRelationManager::class,
            \App\Filament\Resources\OrderResource\RelationManagers\ProductsRelationManager::class,
            \App\Filament\Resources\OrderResource\RelationManagers\SubscriptionRelationManager::class,
        ];
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
