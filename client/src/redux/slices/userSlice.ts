import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface User {
    value: {
        id: string
        name: string,
        user_name: string,
        email: string,
        token:string,
        authenticated: boolean,
    }
}

// Define the initial state using that type
const initialState: User = {
    value: {
        id: "",
        name: "",
        user_name: "",
        email: "",
        token:"",
        authenticated: false,
    }
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clear: () => {
        localStorage.clear()
        return initialState
    },
    setUser:(state,action)=>{
        localStorage.setItem("token",action.payload.token)
        return {
            value :{
                ...action.payload
            }
        }
    }
  },
})

export const {setUser,clear} = userSlice.actions

export default userSlice.reducer