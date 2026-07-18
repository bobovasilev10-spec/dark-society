import { useState } from "react";
import { useLanguage } from "../../../../contexts/LanguageContext";


const Category = ({ categoryData }) => {

    const [showSubCategory, setShowSubCategory] = useState(false);
    const { language } = useLanguage();


    return (
        <div className="">
            <div className="flex justify-between items-center py-3 border-b-2 border-white h-16" >
                <a href={`/category/${categoryData.slug}`}>
                    <p className="cursor-pointer text-xl font-semibold">{categoryData.name[language]}</p>
                </a>
                {categoryData.children.length > 0 &&
                    <div className="flex items-center border-l-2 border-white px-3" onClick={() => setShowSubCategory(prev => !prev)}>
                        {showSubCategory
                            ? <img src="/icons/keyboard_arrow_up.svg" alt="icons" />
                            : <img src="/icons/keyboard_arrow_down.svg" alt="icons" />
                        }
                    </div>
                }
            </div>
            {showSubCategory &&
                <ul className="leading-8 pt-4">
                    {categoryData.children.length > 0 && categoryData.children.map((item, index) => (
                        <a key={index} href={`/category/${categoryData.slug}/${item.slug}`}>
                            <li  className="py-1 hover:underline underline-offset-4 cursor-pointer text-xl">{item.name[language]}</li>
                        </a>
                    ))}
                </ul>
            }
        </div>
    )
}

export default Category;
