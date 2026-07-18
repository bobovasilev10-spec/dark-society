<?php

namespace App\Filament\Resources;

use App\Models\Product;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Fieldset;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\ImportAction;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\Placeholder;
use Filament\Tables\Actions\RestoreAction;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\RestoreBulkAction;
use App\Filament\Resources\ProductResource\Pages;
use Filament\Tables\Actions\ForceDeleteBulkAction;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\ProductResource\RelationManagers;
use Filament\Resources\Concerns\Translatable;

class ProductResource extends Resource
{
    use Translatable;

    public static function getTranslatableLocales(): array
    {
        return ["bg", "en"];
    }
    protected static ?string $model = Product::class;
    protected static ?string $slug = 'products';
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $label = 'Продукт';
    protected static ?string $pluralLabel = 'Продукти';

    protected static ?string $navigationGroup = 'Каталог';

    protected static ?string $recordTitleAttribute = 'name';
    protected static ?int $navigationSort = 0;


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Категория')
                    ->searchable()
                    ->nullable(),

                Select::make('supplier_id')
                    ->relationship('supplier', 'name')
                    ->label('Доставчик')
                    ->nullable()
                    ->searchable()
                    ->preload()
                    ->createOptionForm([
                        TextInput::make('name')
                            ->label('Име')
                            ->required(),
                    ]),

                TextInput::make('name')
                    ->label('Име')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state, '-', 'bg'))),


                TextInput::make('slug')
                    ->required()
                    ->label('Линк')
                    ->unique(Product::class, 'slug', fn($record) => $record),

                TextInput::make('price')
                    ->label('Цена')
                    ->numeric()
                    ->required(),
                TextInput::make('qty')
                    ->label('Наличност')
                    ->hint('Оставете празно ако продукта има опции (като размер)')
                    ->numeric(),
                TextInput::make('weight')
                    ->label('Тегло')
                    ->numeric()
                    ->required(),
                FileUpload::make('image')
                    ->label('Главна снимка')
                    ->directory('products')
                    ->image()
                    ->imageEditor()
                    ->acceptedFileTypes(['image/*', 'video/mp4'])
                    ->required(),

                RichEditor::make('description')
                    ->label('Описание')
                    ->columnSpanFull(),

                Fieldset::make('Статус')
                    ->reactive()
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Активен')
                            ->default(true)
                            ->required(),
                        Toggle::make('is_featured')
                            ->label('Показва се в началната страница')
                            ->required(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category.name')
                    ->label('Категория')
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Име')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);
                    })
                    ->sortable()
                    ->description(
                        fn($record) => $record->slug
                    ),

                TextColumn::make('price')
                    ->label('Цена')
                    ->searchable()
                    ->sortable(),

                ImageColumn::make('image')
                    ->label('Снимка')
                    ->alignCenter()
                    ->sortable(),

                TextColumn::make('supplier.name')
                    ->label('Доставчик'),
            ])
            ->paginated([10, 25, 50, 100])
            ->defaultSort('id', 'desc')
            ->filters([
                SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Категория'),
                SelectFilter::make('supplier_id')
                    ->relationship('supplier', 'name')
                    ->label('Доставчик'),
                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->headerActions([])
            ->defaultPaginationPageOption(25)
            ->bulkActions([
                BulkActionGroup::make([]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ProductImagesRelationManager::class,
            RelationManagers\OptionsRelationManager::class,
            RelationManagers\PricesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'slug'];
    }
}
