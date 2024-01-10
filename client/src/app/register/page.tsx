"use client"
import axios from 'axios'
import { useFormik } from 'formik'
import { NextPage } from 'next'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface Props {}

const Page: NextPage<Props> = ({}) => {

  const [initialValues, setInitialValues] = useState({ first_name: "", last_name: "", email: "", password: "", confirm_password: "" });
  const [passValidity, setPassValidity] = useState([{ name: "length", check: { msg: "Password length must be greater then 8.", status: false } }, { name: "lower_case", check: { msg: "Password must contain a lower case character.", status: false } }, { name: "upper_case", check: { msg: "Password must contain a upper case character.", status: false } }, { name: "special_char", check: { msg: "Password must contain a special character.", status: false } }, { name: "number", check: { msg: "Password must contain a number.", status: false } }])
  const [passVisibility,setPassVisibility]  = useState(false)
  const [confirmPassVisibility,setConfirmPassVisibility] = useState(false)

  const validateForm = (values: any) => {
    const errors: any = {};
    if (!values?.first_name) {
      errors.first_name = 'First name is required.';
    }
    if (!values?.email) {
      errors.email = 'Email is required.';
    }
    // password check
    if (!values?.password) {
      let newPassValidity = structuredClone(passValidity)
      newPassValidity[0].check.status = false
      newPassValidity[1].check.status = false
      newPassValidity[2].check.status = false
      newPassValidity[3].check.status = false
      newPassValidity[4].check.status = false
      setPassValidity(newPassValidity)
      errors.password = 'Password is required.';
    }
    if (values?.password) {
      let password = values?.password
      let newPassValidity = structuredClone(passValidity)
      newPassValidity[0].check.status = password.length >= 8 ? true : false; // length check
      newPassValidity[1].check.status = /[a-z]/.test(password); // lower case check
      newPassValidity[2].check.status = /[A-Z]/.test(password); // upper case check
      newPassValidity[3].check.status = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password); // special char check
      newPassValidity[4].check.status = /\d/.test(password) ; // number check
      setPassValidity(newPassValidity)
    }
    // confirm password check
    if (!values?.confirm_password) {
      errors.confirm_password = 'Confirm password is required.';
    }
    if (values?.confirm_password && values?.password !== values?.confirm_password) {
      errors.confirm_password = 'Confirm password must be same as password.';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validate: validateForm,
    onSubmit: async (values) => {
      try {
        alert(JSON.stringify(values))
      } catch (error) {}
    },
  });

  return (
    <div className="isolate bg-white px-6 py-10 sm:py-20 lg:px-8">
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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Register</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <form className="mx-auto max-w-xl sm:mt-10" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold leading-6 text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first_name"
                id="first_name"
                autoComplete="given-name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {formik.errors.first_name ? <div className="text-sm text-red-500">{formik.errors.first_name}</div> : null}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold leading-6 text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last_name"
                id="last_name"
                autoComplete="family-name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
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
                required={true}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {formik.errors.email ? <div className="text-sm text-red-500">{formik.errors.email}</div> : null}
          </div>
          <div className="sm:col-span-2">
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
          <div className="sm:col-span-2 mb-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2.5 relative">
              <input
                type={confirmPassVisibility ? "text" : "password" }
                name="confirm_password"
                id="confirm_password"
                autoComplete="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {
                confirmPassVisibility ?
                  <svg onClick={() => { setConfirmPassVisibility(!confirmPassVisibility) }} className="h-6 text-gray-700 absolute top-2 right-3" fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512">
                    <path fill="currentColor"
                      d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                    </path>
                  </svg> :
                  <svg onClick={() => { setConfirmPassVisibility(!confirmPassVisibility) }} className="h-6 text-gray-700 absolute top-2 right-3" fill="none" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512">
                    <path fill="currentColor"
                      d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                    </path>
                  </svg>
              }
              {formik.errors.confirm_password ? <div className="text-sm text-red-500">{formik.errors.confirm_password}</div> : null}
            </div>
          </div>

          {
            passValidity.map((item) => {
              return <div className="sm:col-span-2">
                <div className='relative'>
                  {
                    item?.check?.status ?
                    <svg className="h-5 w-5 text-green-500 absolute" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M7 12l5 5l10 -10" />  <path d="M2 12l5 5m5 -5l5 -5" /></svg> :
                      <svg className="h-5 w-5 text-red-500 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  }
                  <p className={`ml-6 text-sm ${item?.check?.status ? 'text-green-500' : 'text-red-500'}`}>{item.check.msg}</p>
                </div>
              </div>
            })
          }

        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's talk
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page