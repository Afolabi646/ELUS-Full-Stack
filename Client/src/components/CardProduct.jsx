import React, { useState } from "react";
import { DisplayPriceInPounds } from "../utils/DisplayPriceInPounds";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(data.units?.[0] || {});
  const isStockAvailable = data.stock > 0;

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div
      onClick={(event) => event.preventDefault()}
      className="border py-2 p-4 grid gap-1 w-[170px] h-[320px] rounded bg-white overflow-hidden"
    >
      <div className="h-[120px] w-full rounded overflow-hidden">
        {data.image?.length > 0 && (
          <img
            src={data.image[0]}
            className="w-full h-full object-scale-down"
          />
        )}
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
      {isStockAvailable && data.units?.length > 0 && selectedUnit && (
        <>
          {data.units.length > 1 && (
            <div className="text-sm mb-2">
              <label className="block text-gray-600 mb-1">Select Unit:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-center"
                value={selectedUnit.name}
                onChange={(e) => {
                  const unit = data.units.find(
                    (unit) => unit.name === e.target.value
                  );
                  handleUnitChange(unit);
                }}
              >
                {data.units.map((unit) => (
                  <option key={unit.name} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center justify-between gap-1 text-sm">
            <div className="font-semibold">
              {DisplayPriceInPounds(selectedUnit.price)}
            </div>
            <div className="">
              <AddToCartButton
                data={{ ...data, selectedUnit: selectedUnit }}
                key={selectedUnit._id}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardProduct;
