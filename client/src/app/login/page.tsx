"use client"
import { NextPage } from 'next'
import { useState } from 'react'
import { useFormik } from 'formik';
import axios from 'axios';
import {  toast } from 'react-toastify';
import { catchApiResponse } from '@/helpers/transformers';

interface Props { }

const Page: NextPage<Props> = ({ }) => {
  const [passVisibility, setPassVisibility] = useState(false);
  const [initialValues, setInitialValues] = useState({ email: '', password: '' })
  const [loginLoader,setLoginLoader] = useState(false);

  const validateForm = (values: any) => {
    const errors: any = {};
    if (!values?.email) {
      errors.email = 'Email is required.';
    }
    if (!values?.password) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        setLoginLoader(true)
        let { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login", values)
        if(!data?.error){
          toast.success(data?.message)
        }
        else{
          toast.error(data?.message)
        }
        setLoginLoader(false)
      } catch (error) {
        toast.error(toast.error(catchApiResponse(error)))
        setLoginLoader(false)
      }
    },
  });
  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Login</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <form className="mx-auto mt-16 max-w-xl sm:mt-20" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">  
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {formik.errors.email ? <div className="text-sm text-red-500">{formik.errors.email}</div> : null}
            </div>
          </div>
          <div className="sm:col-span-2 ">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2.5 relative">
              <input
                type={passVisibility ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {
                passVisibility ?
                  <svg onClick={() => { setPassVisibility(!passVisibility) }} className="h-6 text-gray-700 absolute top-2 right-3" fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512">
                    <path fill="currentColor"
                      d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                    </path>
                  </svg> :
                  <svg onClick={() => { setPassVisibility(!passVisibility) }} className="h-6 text-gray-700 absolute top-2 right-3" fill="none" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512">
                    <path fill="currentColor"
                      d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                    </path>
                  </svg>
              }
              {formik.errors.password ? <div className="text-sm text-red-500">{formik.errors.password}</div> : null}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            disabled={loginLoader}
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {
              loginLoader ? "Logging in ..." :" Login"
            }
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page