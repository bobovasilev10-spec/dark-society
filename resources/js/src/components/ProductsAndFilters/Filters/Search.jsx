import { useState } from "react";
import { getSearchResults } from "../../../services/productService";
import { useTranslation } from "react-i18next";

const Search = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const { t } = useTranslation();
    
    async function searchHandler(event) {
        event.preventDefault();

        try {
            const result = await getSearchResults({ search: searchValue });
            if (result.success) {
                setSearchResult(result.products);
            }
        } catch (error) {}
    }

    function changeHandler(event) {
        if (event.target.value === '') {
            setSearchResult([]);
            setSearchValue(event.target.value);
        } else {
            setSearchValue(event.target.value);
        }
    }

    return (
        <div className="border-2 border-white rounded-xl">
            <form
                className="border-2 border-white rounded-xl grid grid-cols-12 w-full"
                action=""
                onSubmit={searchHandler}
            >
                <div className="col-span-10 flex items-center">
                    <input
                        className="w-full py-1 bg-zinc-900 text-2xl px-3 focus:outline-none focus:border-none border-none self-center h-full rounded-l-lg"
                        type="text"
                        placeholder="Търси..."
                        value={searchValue}
                        onChange={changeHandler}
                    />
                </div>
                <div className="col-span-2  text-center border-l-2 border-white pt-2">
                    <button>
                        <i
                            className="fa-solid fa-magnifying-glass"
                            style={{ fontSize: "26px" }}
                        ></i>
                    </button>
                </div>
            </form>

            {searchResult.length > 0 && (
                <ul
                    className="flex flex-col gap-4 px-3 overflow-auto mt-2"
                    style={{ height: "300px" }}
                >
                    {searchResult.map((product, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center border-b-2 border-white pb-2"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    className="rounded-lg"
                                    width={80}
                                    src={`/storage/${product.image}`}
                                    alt=""
                                />
                                <p>{product.name}</p>
                            </div>
                            <p>{Number(product.price).toFixed(2)} €</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
