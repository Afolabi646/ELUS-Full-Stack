import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { validURLConvert } from '../utils/validURLConvert'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import realBanner from '../assets/realBanner.jpg'


const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate()

const handleRedirectProductListPage = (id, cat) => {
  const url = `/${validURLConvert(cat)}-${id}`;
  navigate(url);
}; 


 

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div
          className={`w-full bg-blue-100 rounded ${!realBanner && "animate-pulse"} my-2 `}
        >
          <div className='lg:h-screen lg:w-fit mx-auto w-[95%]'>
            <img src={realBanner} alt="" 
            className="w-full h-full object-scale-down"/>
          </div>
        </div>
      </div>

      <div className='p-2 font-semibold'>
        <h2>Shop By Category</h2>
      </div>
      <div className="container mx-auto px-4 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 min-h-20 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat._id + "displayCategory"}
                  className="w-full h-full"
                  onClick={() =>
                    handleRedirectProductListPage(cat._id, cat.name)
                  }
                >
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src={cat.image}
                      className="w-full h-full object-scale-down"
                    />
                    <p className="font-semibold text-xs w-18 text-center">
                      {cat.name}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/**display  category products*/}
      {categoryData.map((c, index) => {
        return (
          <CategoryWiseProductDisplay
            key={c?._id + "CategoryWiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
}


export default Home