import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux'

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector(state => state.product.allSubCategory)

  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  

  const category = params?.category?.split("-");
  const categoryName = category?.slice(0, category?.length - 1)?.join("");
  const categoryId = params?.category?.split("-").splice(-1)[0];
  const subCategoryId = params?.subCategory;

const fetchProductData = async () => {
  console.log("show", categoryId, subCategoryId);
try {
  setLoading(true);
  const response = await Axios({
    ...SummaryApi.getProductByCategory,
    data: {
      id: categoryId,
      page,
      limit: 10,
    },
  });

  const { data: responseData } = response;
  if (responseData.success) {
    if (responseData.page === 1) {
      setProducts(responseData.data);
    } else {
      setProducts([...products, ...responseData.data]);
    }
    setTotalPage(responseData.totalCount);
  }
} catch (error) {
  AxiosToastError(error);
} finally {
  setLoading(false);
}
};


  useEffect(() => {
    console.log("use",categoryId, subCategoryId);
    fetchProductData();
  }, [params]);

useEffect(() => {
  const sub = AllSubCategory.filter((s) => {
    return s.category.some((el) => el._id === categoryId);
  });
  setDisplaySubCategory(sub);
}, [params, AllSubCategory]);


  return (
    <section className="sticky top-24 lg:top-20">
      
        <div className="bg-blue-100">
          <div className="bg-white shadow-md p-2">
            <h3 className="font-medium text-center text-3xl">{categoryName}</h3>
          </div>
          <div>
            {products.length === 0 && !loading ? (
              <p className='flex justify-center items-center'>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 p-4 gap-4 lg:grid-cols-4 md:grid-cols-3">
                {products.map((product, index) => {
                  return (
                    <CardProduct
                      data={product}
                      key={product._id + "productCategory" + index}
                    />
                  );
                })}
              </div>
            )}
            {loading && <Loading />}
          </div>
        </div>
      
    </section>
  );
};

export default ProductListPage;
