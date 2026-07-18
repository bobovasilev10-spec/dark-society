'use client';

import Category from "./Category";

const AllCategories = ({ categories }) => {

    return (

        <div className="text-white pb-10 text-start">
            {categories?.length > 0 && categories.map((category, index) => (
                <Category key={index} categoryData={category} />
            ))}
        </div>
    )
}

export default AllCategories;
