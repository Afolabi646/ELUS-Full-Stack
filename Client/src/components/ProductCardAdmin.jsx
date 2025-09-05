import React, { useEffect } from "react";

import { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
import ConfirmBox from "./ConfirmBox";
import { IoClose } from "react-icons/io5";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const ProductCardAdmin = ({ data, onEdit, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = ()=>{
    setOpenDelete(false)
  }

  const handleDelete = async()=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteProduct,
            data : {
              _id : data._id
            }
          })

          const { data : responseData } = response

          if(responseData.success){
            toast.success(responseData.message)
            if(fetchProductData){
              fetchProductData()
            }
            setOpenDelete(false)
          }
      } catch (error) {
        AxiosToastError(error)
      }
  }

  return (
    <div className="w-36 h-48 p-4 rounded bg-white">
      <div>
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium">{data.unit}</p>
      <p className="text-slate-400">{data.name}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onEdit}
          className="border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-800 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>

      {openDelete && (
        <section className="fixed top-0 right-0 left-0 bottom-0 bg-neutral-600/70 z-50 p-4 flex justify-center items-center rounded">
          <div className="bg-white p-4 w-full max-w-md rounded">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">Delete Permanently</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="py-2">Are you sure you want to delete permanently?</p>
            <div className="flex justify-end gap-5 py-4">
              <button
                onClick={handleDeleteCancel}
                className="border px-3 py-1 rounded bg-red-100 border-red-300 text-red-400 hover:bg-red-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border px-3 py-1 rounded bg-red-200 border-red-700 text-red-900 hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
