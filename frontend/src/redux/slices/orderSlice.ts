import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ordersService } from "../../services/orders.api.service";
import { IOrderModel } from "../../models/IOrderModel";
import {AxiosError} from "axios";

interface OrdersState {
  orders: IOrderModel[];
  totalPages: number;
  error: string | null;
  loader: boolean;
}

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (params: { page: number; sortBy: string; sortOrder: string } & Record<string, any>, thunkAPI) => {
    try {
      const response = await ordersService.getOrders(params);
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
  loader: false,
};

export const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    changeLoaderState: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.totalPages = 1;
      state.error = "No orders found for the selected filters";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.orders = action.payload.data;
        state.totalPages = Math.ceil(action.payload.total / (action.payload.limit || 25));
        state.loader = false
        state.error = null
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loader = false
        state.error = action.error.message || 'Error occurred';
      });
  },
});

export const ordersActions = {
  ...ordersSlice.actions,
  getOrders
}