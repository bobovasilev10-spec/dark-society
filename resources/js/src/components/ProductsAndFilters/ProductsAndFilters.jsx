'use client';
import { useEffect, useState } from 'react';

import Filters from './Filters/Filters';
import Products from './Products/Products';
import TopFilters from './Filters/TopFilters';

import "./ProductsAndFilters.css";

const ProductsAndFilters = ({ productData, categories }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (productData) {
            setProducts(productData);
        }
    }, []);

    const filterHandler = (action) => {
        if (action.filter === "top-filter") {
            let result = [];
            switch (action.params) {
                case "Първо най-нови":
                    setProducts(productData);
                    break;
                case "Първо най-скъпи":
                    result = [...products].sort((a, b) => b.price - a.price);
                    setProducts(result);
                    break;
                case "Първо най-евтините":
                    result = [...products].sort((a, b) => a.price - b.price);
                    setProducts(result);
                    break;
                default:
                    setProducts(productData);
                    break;
            }
        } else if (action.filter === "price") {
            const priceFrom = action.params.priceFrom;
            const priceTo = action.params.priceTo;

            let result = productData.filter((product) => {
                if (product.price >= priceFrom && product.price <= priceTo) {
                    return product;
                }
            });
            setProducts(result);
        }
    };

    return (
        <div className='products_and_filters'>
            <div className="container mx-auto">
                <TopFilters productData={products} productsCount={products?.length} filterHandler={filterHandler} categories={categories}/>

                <div className="grid grid-cols-12 mt-4 lg:mt-10">
                    <Filters productData={productData} filterHandler={filterHandler} categories={categories}/>
                    <div className="col-span-1 flex justify-center">
                        <div className="border-l-2 border-white"></div>
                    </div>
                    <Products productData={products} />
                </div>
            </div>
        </div>
    );
}

export default ProductsAndFilters;
