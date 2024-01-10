"use client"
import { RootState } from '@/redux/store';
import { NextPage } from 'next'
import { redirect, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Home from '../page';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clear, setUser } from '@/redux/slices/userSlice';
import { catchApiResponse } from '@/helpers/transformers';

interface Props {
  children: ReactNode;
}

const MiddlewareProvider: NextPage<Props> = ({ children }) => {
  const [check, setCheck] = useState(1);
  const [initiated, setInitiated] = useState(false);
  const [goTo, setGoTo] = useState("");
  const path = usePathname();
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.userReducer.value);

  const validatedRedirect = (path: string) => {
    setCheck(3);
    setGoTo(path);
  }

  const validateToken = async (token: string) => {
    try {
      let { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/validate",{ headers: { Authorization: `Bearer ${token}` } })
      if(!data?.error){
        dispatch(setUser(data.result))
      }
      else{
        dispatch(clear())
      }
    } catch (error) {
      validatedRedirect("/")
    }
  }

  const handleUserAuthentication = async () => {
    const pathList = path.split("/");
    let token = localStorage.getItem("token");
    if(!user.authenticated && token){
      validateToken(token)
    }
    if (["login", "register", "forgot-password", "reset-password"].includes(pathList[1])) {
      setTimeout(() => {
        user.authenticated ? validatedRedirect("/user/profile") : setCheck(2)
      }, 500);
    } else if (pathList[1] === "user") {
      user.authenticated ? setCheck(2) : setCheck(0);
    } else {
      setCheck(2);
    }
  };

  useEffect(() => {
    try {
      setInitiated(true);
      handleUserAuthentication();
    } catch (error) {
      setCheck(0);
    }
  }, [path, user]);

  if (!initiated && path === "/") {
    return <Home />
  }
  else {
    if (check === 2) {
      return children;
    } else if (check === 3) {
      redirect(goTo);
    } else if (check === 0) {
      redirect("/");
    } else {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
    }
  }
}

export default MiddlewareProvider;
