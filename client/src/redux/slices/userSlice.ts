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
        user_id: "dummy",
        name: "dummy",
        user_name: "dummy",
        email: "dummy",
        authenticated: false,
    }
}

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    logout: () => {
        return initialState
    },
    login:(state,action)=>{
        return {
            value :{
                ...action.payload
            }
        }
    }
  },
})

export const {login,logout} = counterSlice.actions

export default counterSlice.reducer