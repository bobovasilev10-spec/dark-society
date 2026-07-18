import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductsAndFilters from "../../components/ProductsAndFilters/ProductsAndFilters";

import * as productService from "../../services/productService";
import Loader from "../../components/utils/Loader";
const Products = ({ products, categories }) => {
    const [productsData, setProductsData] = useState(null);

    const { mainSlug, childSlug } = useParams();

    useEffect(() => {
        const slug = childSlug ? childSlug : mainSlug;
        productService
            .getCategoryData(slug)
            .then((result) => {
                setProductsData(result);
            })
            .catch((error) => {
                productsData(null);
            });
    }, [mainSlug, childSlug]);
    if (!productsData) {
        return <Loader />;
    }
    return (
        <section>
            <ProductsAndFilters
                productData={productsData.products}
                categories={categories}
            />
        </section>
    );
};

export default Products;
