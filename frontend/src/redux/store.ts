import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {managerSlice} from "./slices/managerSlice";
import {ordersSlice} from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    manager: managerSlice.reducer,
    orders: ordersSlice.reducer
  }
})

type RootState = ReturnType<typeof store.getState>
export const useAppSelector = useSelector.withTypes<RootState>()

type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()