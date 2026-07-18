<?php

namespace App\Filament\Resources;

use Closure;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Tables;
use App\Models\Coupon;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Illuminate\Support\HtmlString;
use Illuminate\Database\Eloquent\Builder;
use App\Filament\Resources\CouponResource\Pages;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\CouponResource\RelationManagers;
use Filament\Forms\Get;
use Filament\Resources\Concerns\Translatable;

class CouponResource extends Resource
{
    use Translatable;

    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-adjustments-horizontal';
    protected static ?string $pluralLabel = 'Купони';
    protected static ?string $label = 'Купон';

    protected static ?int $navigationSort = 7;
    protected static ?string $navigationGroup = 'Каталог';
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
            Forms\Components\TextInput::make('name')
                ->label('Име')
                ->required()
                ->maxLength(191),
            Forms\Components\TextInput::make('code')
                ->label('Код')
                ->required()
                ->hint(
                    function ($component, Get $get) {
                        // generate random code
                        $randomCode = self::generateCode();

                        $hint =
                            /** @lang text */
                            '
                                    <span wire:click="$set(\'' . $component->getStatePath() . '\', \'' . $randomCode . '\')" class="font-medium h- px-2 py-0.5 rounded-xl bg-primary-500 text-white text-xs tracking-tight mt-[10px] cursor-pointer">
                                        Създай случаен код
                                    </span>
                                    ';

                        return new HtmlString($hint);
                    }
                )
                ->maxLength(191),
            Forms\Components\Select::make('discount_type')
                ->label('Тип на отстъпката')
                ->default('percent')
                ->required()
                ->reactive()
                ->options([
                    'percent' => 'Процент',
                    'fixed' => 'Фиксирана сума',
                ]),
            Forms\Components\TextInput::make('discount')
                ->label('Отстъпка')
                ->numeric()
                ->default(5)
                ->minValue(0)
                ->suffix(
                    function (Get $get) {
                        return $get('discount_type') === 'percent' ? '%' : 'лв.';
                    }
                )
                ->required(),
            Forms\Components\TextInput::make('deduction_minimum_amount')
                ->label('Минимална сума на продажбите')
                ->numeric()
                ->minValue(0)
                ->default(0)
                ->helperText('Минимална сума на продажби с този купон, за да е активно отчисление')
                ->visible(fn(Get $get) => $get('user_id') !== null),
            Forms\Components\Select::make('deduction_type')
                ->label('Тип на отчислението')
                ->default('percent')
                ->reactive()
                ->options([
                    'percent' => 'Процент',
                    'fixed' => 'Фиксирана сума',
                ])
                ->visible(fn(Get $get) => $get('user_id') !== null),
            Forms\Components\TextInput::make('deduction')
                ->label('Отчисление')
                ->numeric()
                ->default(5)
                ->minValue(0)
                ->suffix(
                    function (Get $get) {
                        return $get('deduction_type') === 'percent' ? '%' : 'лв.';
                    }
                )
                ->visible(fn(Get $get) => $get('user_id') !== null),
            Forms\Components\TextInput::make('minimum_amount')
                ->label('Минимална сума')
                ->numeric()
                ->minValue(0)
                ->default(0)
                ->helperText('Минимална сума на поръчката, за която да е валиден купона'),
            Forms\Components\Fieldset::make('valid')
                ->label('Валидност')
                ->schema([
                    Forms\Components\DateTimePicker::make('date_from')
                        ->label('От дата')
                        ->helperText('Дата, от която купона е валиден')
                        ->default(now()->startOfDay())
                        ->hint('При празно поле, купона е валиден от момента на създаване')
                        ->nullable(),
                    Forms\Components\DateTimePicker::make('date_to')
                        ->label('До дата')
                        ->helperText('Дата, до която купона е валиден')
                        ->hint(
                            function ($component, Get $get) {
                                $hint = '<div class="flex flex-wrap space-x-2">';

                                $start_date = $get('date_from');
                                if ($start_date == null) {
                                    $start_date = Carbon::now();
                                }

                                $dates = [
                                    [
                                        'label' => '1 седмица',
                                        'value' => Carbon::make($start_date)->addWeek()->format('Y-m-d H:i:s'),
                                        'class' => 'bg-primary-500',
                                    ],
                                    [
                                        'label' => '2 седмици',
                                        'value' => Carbon::make($start_date)->addWeeks(2)->format('Y-m-d H:i:s'),
                                        'class' => 'bg-primary-500',
                                    ],
                                    [
                                        'label' => '1 месец',
                                        'value' => Carbon::make($start_date)->addMonth()->format('Y-m-d H:i:s'),
                                        'class' => 'bg-primary-500',
                                    ],
                                    [
                                        'label' => '2 месеца',
                                        'value' => Carbon::make($start_date)->addMonths(2)->format('Y-m-d H:i:s'),
                                        'class' => 'bg-primary-500',
                                    ],
                                    [
                                        'label' => 'Безсрочно',
                                        'value' => null,
                                        'class' => 'bg-success-500',
                                    ],
                                ];
                                foreach ($dates as $date) {
                                    $hint .= '
                                    <span wire:click="$set(\'' . $component->getStatePath() . '\', \'' . $date['value'] . '\')" class="font-medium h- px-2 py-0.5 rounded-xl ' . $date['class'] . ' text-white text-xs tracking-tight mt-[10px] cursor-pointer">
                                        ' . $date['label'] . '
                                    </span>
                                    ';
                                }

                                $hint .= '</div>';

                                return new HtmlString($hint);
                            }
                        )
                        ->nullable()
                ]),
            Forms\Components\TextInput::make('quantity')
                ->label('Количество')
                ->numeric()
                ->minValue(0)
                ->helperText('Брой на наличните купони')
                ->hint('При празно поле, купона е валиден без ограничение')
                ->nullable(),
            Forms\Components\Toggle::make('is_active')
                ->label('Активен')
                ->default(true)
                ->required(),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        $tableColumns = [
            Tables\Columns\TextColumn::make('code')
            ->label('Код')
                ->description(
                    function ($record) {
                        return $record->name;
                    }
                )
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('discount')
            ->label('Отстъпка')
            ->suffix(
                function ($record) {
                    return $record->discount_type === 'percent'
                    ? '%'
                        : 'лв.';
                }
            )
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('minimum_amount')
            ->label('Минимална сума')
            ->suffix('лв.')
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('date_from')
            ->label('От дата')
            ->sortable()
                ->description(
                    function ($record) {
                        return $record->date_from
                            ? $record->date_from->diffForHumans(parts: 3)
                            : '-';
                    }
                )
                ->dateTime(),
            Tables\Columns\TextColumn::make('date_to')
            ->label('До дата')
            ->sortable()
                ->description(
                    function ($record) {
                        return $record->date_to
                            ? $record->date_to->diffForHumans(parts: 3)
                            : 'Безсрочно';
                    }
                )
                ->dateTime(),
            Tables\Columns\TextColumn::make('quantity')
            ->label('Количество')
            ->formatStateUsing(
                function ($record) {
                    return $record->quantity
                        ?: 'Неограничено';
                }
            )
                ->searchable()
                ->sortable(),
            Tables\Columns\IconColumn::make('is_active')
            ->label('Активен')
            ->boolean(),
        ];

        return $table
            ->columns($tableColumns)
            ->defaultSort('id', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
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
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
    private static function generateCode($length = 6): string
    {
        // generate random code without 0, O, I, l
        $characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $code = '';
        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[rand(0, $charactersLength - 1)];
        }
        // check if code already exists
        if (Coupon::where('code', $code)->exists()) {
            return self::generateCode($length); // will loop until unique code is generated
        }

        return $code;
    }
}
