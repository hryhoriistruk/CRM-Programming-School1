import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ordersService } from "../../services/orders.api.service";
import { IOrderModel } from "../../models/IOrderModel";
import {AxiosError} from "axios";

interface OrdersState {
  orders: IOrderModel[];
  totalPages: number;
  error: string | null;
}

interface FetchOrdersParams {
  currentPage: number;
  sortBy: string;
  sortOrder: string;
}

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async ({ currentPage, sortBy, sortOrder }: FetchOrdersParams, thunkAPI) => {
    try {
      const response = await ordersService.getOrders(currentPage, sortBy, sortOrder);
      return thunkAPI.fulfillWithValue(response);
    } catch (e) {
      const error = e as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data)
    }
  }
);

const initialState: OrdersState = {
  orders: [],
  totalPages: 1,
  error: null,
};

export const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.orders = action.payload.data;
        state.totalPages = Math.ceil(action.payload.total / (action.payload.limit || 25));
        state.error = null
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Error occurred';
      });
  },
});

export const ordersActions = {
  ...ordersSlice.actions,
  getOrders
}