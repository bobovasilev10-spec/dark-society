<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Get;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Resources\RelationManagers\RelationManager;
use Carbon\Carbon;

class PricesRelationManager extends RelationManager
{
    protected static string $relationship = 'prices';
    protected static ?string $label = 'Цена';
    protected static ?string $pluralLabel = 'Цени';
    protected static ?string $title = 'Цени';
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('date_from')
                    ->label('От дата')
                    ->reactive()
                    ->required()
                    ->hint(
                        function (Get $get) {
                            return Carbon::make($get('date_from'))?->diffForHumans(parts: 3) ?? 'Няма';
                        }
                    )
                    //                ->helperText('Ако е празно, цената влиза в сила от създаването на продукта')
                    ->nullable(),
                Forms\Components\DatePicker::make('date_to')
                    ->label('До дата')
                    ->required()
                    ->reactive()
                    ->hint(
                        function (Get $get) {
                            return Carbon::make($get('date_to'))?->diffForHumans(parts: 3) ?? 'Няма';
                        }
                    )
                    //                ->helperText('Ако е празно, цената е валидна безкрайно')
                    ->nullable(),

                Forms\Components\Radio::make('discount_type')
                    ->label('Тип на отстъпката')
                    ->options([
                        'fixed' => 'Фиксирана',
                        'percentage' => 'Процент',
                    ])
                    ->default('fixed')
                    ->reactive()
                    ->required(),
                Forms\Components\TextInput::make('value')
                    ->label(function (Get $get) {
                        return $get('discount_type') === 'fixed' ? 'Нова фиксирана цена' : 'Процент отстъпка';
                    })
                    ->numeric()
                    ->reactive()
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('value')
                    ->label('Отстъпка')
                    ->suffix(function ($record) {
                        return $record->discount_type === 'fixed' ? 'лв.' : '%';
                    })
                    ->formatStateUsing(
                        function ($state) {
                            return number_format($state, 2, '.', ' ');
                        }
                    ),
                Tables\Columns\TextColumn::make('date_from')
                    ->formatStateUsing(
                        function ($state) {
                            return
                                $state ? Carbon::make($state)->format('d.m.Yг') : '∞';;
                        }
                    )
                    ->description(
                        function ($record) {
                            return $record->date_from
                                ? Carbon::make($record->date_from)->diffForHumans(parts: 3)
                                : 'Няма';
                        }
                    )
                    ->label('От дата'),
                Tables\Columns\TextColumn::make('date_to')
                    ->formatStateUsing(
                        function ($state) {
                            return $state ? Carbon::make($state)->format('d.m.Yг') : '∞';
                        }
                    )
                    ->description(
                        function ($record) {
                            return $record->date_to
                                ? Carbon::make($record->date_to)->diffForHumans(parts: 3)
                                : 'Няма';
                        }
                    )
                    ->label('До дата'),
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
