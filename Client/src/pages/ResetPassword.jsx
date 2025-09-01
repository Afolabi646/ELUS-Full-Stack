import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
      email : "",
      newPassword : "",
      confirmPassword : ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateValue = Object.values(data).every((e1) => e1);


    useEffect(()=>{
      if(!(location?.state?.data?.success)){
       
      }

      if(location?.state?.email) {
        setData((preve)=>{
          return {
            ...preve,
            email: location?.state?.email,
          };
        })
      }
    }, [])

      const handleChange = (e) => {
        const { name, value } = e.target;

        setData((preve) => {
          return {
            ...preve,
            [name]: value,
          };
        });
      };


    console.log("data", data)

     const handleSubmit = async (e) => {
       e.preventDefault()

       if(data.newPassword !== data.confirmPassword){
        toast.error("new password and confirm password must be same")
       }

       try {
         const response = await Axios({
           ...SummaryApi.resetPassword,
           data: data,
         });

         if (response.data.error) {
           toast.error(response.data.message);
         }

         if (response.data.success) {
           toast.success(response.data.message);
           navigate("/login", );
           setData({
             email: "",
             newPassword: "",
             confirmPassword: "",
           });
         }

       } catch (error) {
         AxiosToastError(error);
       }
     };


  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="text-center bg-green-800 py-2 text-white">
          Enter Your New Password
        </p>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password : </label>

            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-yellow-300">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none"
                name="newPassword"
                placeholder="Enter you new password"
                value={data.newPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password : </label>

            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-yellow-300">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={data.confirmPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validateValue}
            className={`${
              validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }   text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Change Password
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-500"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPassword