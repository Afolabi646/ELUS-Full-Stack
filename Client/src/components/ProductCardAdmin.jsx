import React from "react";

import { useState } from "react";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  return (
    <div>
      <div className="w-36 h-36 p-4 rounded">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium">{data?.name}</p>
      <p className="text-slate-400">{data?.unit}</p>

      <div className="grid grid-cols-2 gap-3 py-2"></div>
    </div>
  );
};

export default ProductCardAdmin;
