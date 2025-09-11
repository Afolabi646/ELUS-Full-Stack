import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    units: [],
    more_details: {},
    stock: "",
    price: "",
  });
  const [unitName, setUnitName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return { ...preve, [name]: value };
    });
  };

const handleAddUnit = (e) => {
  e.preventDefault();
  if (!unitName || !unitPrice) return;
  setData((prev) => ({ 
    ...prev, 
    units: [...prev.units, { name: unitName, price: unitPrice }],
  }));
  setUnitName("");
  setUnitPrice("");
};


  const handleRemoveUnit = (index) => {
    setData((prev) => ({
      ...prev,
      units: prev.units.filter((unit, i) => i !== index),
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;
    setData((preve) => {
      return { ...preve, image: [...preve.image, imageUrl] };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    setData((preve) => {
      return { ...preve, image: preve.image.filter((img, i) => i !== index) };
    });
  };

  const handleRemoveCategory = async (index) => {
    setData((preve) => {
      return { ...preve, category: preve.category.filter((cat, i) => i !== index) };
    });
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;
    setData((preve) => {
      return {
        ...preve,
        more_details: { ...preve.more_details, [fieldName]: "" },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          units: [],
          more_details: {},
          stock: "",
          price: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid p-4 gap-4">
            <div className="grid gap-1">
              <label htmlFor="name" className="font-medium">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                className="bg-blue-50 p-2 outline-none border focus-within:border-yellow-400 rounded"
              />
            </div>
          </div>

          <div>
            <p className="font-medium">Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={35} />
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
              {/**display images */}
              <div className="flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label className="font-medium">Category</label>
            <div>
              <select
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  console.log(category);

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((c, index) => {
                  return <option value={c._id}>{c.name}</option>;
                })}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.category.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Units</label>
            <div className="flex flex-wrap gap-3">
              {data.units.map((unit, index) => (
                <div
                  key={index}
                  className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                >
                  <p>
                    {unit.name} - {unit.price}
                  </p>
                  <div
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveUnit(index)}
                  >
                    <IoClose size={20} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-col">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Unit name (e.g. 1kg)"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-35 lg:w-40 bg-blue-50 p-2 outline-none border focus-within:border-yellow-400 rounded"
                />
                <input
                  type="number"
                  placeholder="Unit price"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-25 lg:w-30 bg-blue-50 p-2 outline-none border focus-within:border-yellow-400 rounded"
                />
              </div>
              <button
                className="mb-5 bg-yellow-400 hover:bg-yellow-100 py-1 px-3 text-center font-semibold border border-yellow-400 hover:text-neutral-900 cursor-pointer rounded"
                onClick={(e) => handleAddUnit(e)}
              >
                Add Unit
              </button>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="stock" className="font-medium">
              Number of stock
            </label>
            <input
              type="text"
              id="stock"
              placeholder="Enter product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="mb-5 bg-blue-50 p-2 outline-none border focus-within:border-yellow-400 rounded"
            />
          </div>

          {/**Add More Fields */}

          {Object?.keys(data?.more_details)?.map((k, index) => {
            return (
              <div className="grid gap-1">
                <label htmlFor={k} className="font-medium">
                  {k}
                </label>
                <input
                  type="text"
                  id={k}
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((preve) => {
                      return {
                        ...preve,
                        more_details: {
                          ...preve.more_details,
                          [k]: value,
                        },
                      };
                    });
                  }}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-yellow-400 rounded"
                />
              </div>
            );
          })}

          <div
            onClick={() => setOpenAddField(true)}
            className="mb-3 bg-yellow-400  hover:bg-yellow-100 py-1 px-3 w-32 text-center font-semibold border border-yellow-400 hover:text-neutral-900 cursor-pointer rounded"
          >
            Add Fields
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-100 py-1 px-3 text-center font-semibold border border-yellow-400 hover:text-neutral-900 cursor-pointer rounded">
            Submit
          </button>
        </form>
      </div>

      {viewImageURL && (
        <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
      )}

      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
