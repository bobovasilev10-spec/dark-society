import { useEffect } from "react";
import Slide from "./Slide";

const Products = ({productData}) => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [productData]);

    return (
        <div className="col-span-12 xl:col-span-8 px-5 xl:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {productData?.length > 0 && productData.map((product, index) => (
                    <Slide productData={product} key={index} />
                ))}
            </div>
        </div>
    );
}

export default Products;
