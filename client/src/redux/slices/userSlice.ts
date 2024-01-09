import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface User {
    value: {
        user_id: string
        name: string,
        user_name: string,
        email: string,
        authenticated: boolean,
    }
}

// Define the initial state using that type
const initialState: User = {
    value: {
        user_id: "",
        name: "",
        user_name: "",
        email: "",
        authenticated: false,
    }
}

export const userSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clear: () => {
        return initialState
    },
    setUser:(state,action)=>{
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