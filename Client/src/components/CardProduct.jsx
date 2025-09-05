import React, { useState } from 'react'
import { DisplayPriceInPounds } from '../utils/DisplayPriceInPounds';

import AddToCartButton from './AddToCartButton';

const CardProduct = ({data}) => {
    
    const [loading, setLoading] = useState(false)
  
    
  return (
    <div
      
      onClick=
      {(event) => event.preventDefault()}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-32 lg:min-w-52 rounded bg-white"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          className="w-25 h-25 object-scale-down scale overflow-hidden"
        />
      </div>
      <div className="rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50">
        10 min
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base">{data.unit}</div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="font-semibold">{DisplayPriceInPounds(data.price)}</div>
        <div className="">
          <AddToCartButton data={data} />
        </div>
      </div>
    </div>
  );
}

export default CardProduct