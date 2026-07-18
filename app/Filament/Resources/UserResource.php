<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\HtmlString;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $label = 'Потребител';
    protected static ?string $pluralLabel = 'Потребители';

    protected static ?string $navigationGroup = 'Поръчки';
    protected static ?int $navigationSort = 0;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Име')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('Имейл')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('password')
                    ->label('Парола')
                    ->password()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_admin')
                    ->required(),
                // Forms\Components\Fieldset::make('Данни за фирмата')
                //     ->schema([
                //         Forms\Components\TextInput::make('bulstat')
                //             ->label('Булстат')
                //             ->maxLength(191),
                //         Forms\Components\TextInput::make('mol')
                //             ->label('МОЛ')
                //             ->required()
                //             ->maxLength(191),
                //         Forms\Components\TextInput::make('address')
                //             ->label('Адрес')
                //             ->maxLength(191),
                //         Forms\Components\TextInput::make('city')
                //             ->label('Град')
                //             ->maxLength(191),
                //         Forms\Components\TextInput::make('phone')
                //             ->label('Телефон')
                //             ->tel()
                //             ->maxLength(191),
                //     ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Име')
                    ->searchable()
                    ->description(
                        function (User $record) {
                            return $record->email;
                        }
                    ),
                // Tables\Columns\TextColumn::make('bulstat')
                //     ->searchable(
                //         query: function (Builder $query, $search) {
                //             $query->where('name', 'like', '%' . $search . '%')
                //                 ->orWhere('email', 'like', '%' . $search . '%')
                //                 ->orWhere('bulstat', 'like', '%' . $search . '%')
                //                 ->orWhere('mol', 'like', '%' . $search . '%')
                //                 ->orWhere('address', 'like', '%' . $search . '%')
                //                 ->orWhere('city', 'like', '%' . $search . '%')
                //                 ->orWhere('phone', 'like', '%' . $search . '%');
                //         }
                //     )
                //     ->label('Фирма')
                //     ->description(
                //         function (User $record) {
                //             $html = '<ul class="list-none text-sm text-slate-500">';
                //             if($record->mol) {
                //                 $html .= '<li>МОЛ: ' . $record->mol . '</li>';
                //             }
                //             if($record->address) {
                //                 $html .= '<li>Адрес: ' . $record->address . '</li>';
                //             }
                //             if($record->city) {
                //                 $html .= '<li>Град: ' . $record->city . '</li>';
                //             }
                //             if($record->phone) {
                //                 $html .= '<li>Телефон: ' . $record->phone . '</li>';
                //             }
                //             $html .= '</ul>';

                //             return new HtmlString($html);
                //         }

                //     ),
                Tables\Columns\IconColumn::make('is_admin')
                    ->label('Администратор')
                    ->boolean()
                    ->sortable(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
