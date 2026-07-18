import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as productService from "../../services/productService";

import Loader from "../../components/utils/Loader";
import ProductDetails from "../../components/ProductDetails/ProductDetails";

const ProductDetailsPage = ({ products }) => {

    const [ productData, setproductData ] = useState(null);
    const [ similarProducts, setSimilarProducts ] = useState(null);

    const { slug } = useParams();

    useEffect(() => {
        productService
            .getProduct(slug)
            .then((result) => {
                setproductData(result.product);
                if (result?.similar_products) {
                    setSimilarProducts(result.similar_products);
                }
            })
            .catch((error) => {
                similarProducts(null);
            });

    }, [slug]);

    if (!productData) {
        return <Loader />;
    }

    return (
        <section className="details_container">
            <ProductDetails productData={productData} similarProducts={similarProducts}/>
        </section>
    );
};

export default ProductDetailsPage;
