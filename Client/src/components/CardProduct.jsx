import React, { useState } from "react";
import { DisplayPriceInPounds } from "../utils/DisplayPriceInPounds";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const isStockAvailable = data.stock > 0;

  return (
    <div
      onClick={(event) => event.preventDefault()}
      className="border py-2 p-4 grid gap-1 w-[170px] h-[280px] rounded bg-white overflow-hidden"
    >
      <div className="h-[120px] w-full rounded overflow-hidden">
        <img src={data.image[0]} className="w-full h-full object-scale-down" />
      </div>
      <div
        className={`rounded text-xs w-fit p-[1px] px-2 ${
          isStockAvailable
            ? "text-green-600 bg-green-50"
            : "text-red-600 bg-red-50"
        }`}
      >
        {isStockAvailable ? "In stock" : "Not in stock"}
      </div>
      <div className="font-medium text-sm line-clamp-2">{data.name}</div>
      {isStockAvailable && (
        <>
          <div className="text-sm">{data.unit}</div>
          <div className="flex items-center justify-between gap-1 text-sm">
            <div className="font-semibold">
              {DisplayPriceInPounds(data.price)}
            </div>
            <div className="">
              <AddToCartButton data={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardProduct;
