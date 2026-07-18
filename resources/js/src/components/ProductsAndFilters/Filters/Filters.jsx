import Categories from "./AllCategories/Allcategories";
import PriceFilter from "./PriceFilter";
import Search from "./Search";


const Filters = ({ productData, categories, filterHandler }) => {

    return (
        <div className="hidden xl:flex col-span-3 justify-between ">
            <div className="w-full">
                {/* <Search /> */}
                {productData.length > 10 &&  <PriceFilter productData={productData} filterHandler={filterHandler}/>}
                <Categories categories={categories}/>
            </div>
        </div>

    )
}

export default Filters;
