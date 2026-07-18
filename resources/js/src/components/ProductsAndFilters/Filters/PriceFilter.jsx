import { Box, Slider } from "@mui/material";
import { useState } from "react";

export default function PriceFilter({ productData, filterHandler }) {
    const minPrice = Math.min(...productData.map((p) => p.price));
    const maxPrice = Math.max(...productData.map((p) => p.price));

    const [value, setValue] = useState([minPrice, maxPrice]);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        filterHandler({
            filter: "price",
            params: {
                priceFrom: newValue[0],
                priceTo: newValue[1],
            },
        });
    };

    return (
        <div className="mt-10">
            <Box>
                <Slider
                    sx={{ color: "white" }}
                    min={minPrice}
                    max={maxPrice}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaLabel={() => "Price range"}
                    getAriaValueText={(value) => `${value}°C`}
                />
            </Box>
        </div>
    );
}
