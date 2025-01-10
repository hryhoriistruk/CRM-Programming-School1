import React, {useEffect, useState} from 'react';
import {ordersService} from "../../services/orders.api.service";
import {useNavigate, useSearchParams} from "react-router-dom";
import {AxiosError} from "axios";
import {authService} from "../../services/auth.api.service";
import {IOrderModel} from "../../models/IOrderModel";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import Pagination from "../../components/Pagination/Pagination";
import styles from './Orders.module.css'
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ordersActions} from "../../redux/slices/orderSlice";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const {orders, totalPages, error} = useAppSelector(state => state.orders);

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect(() => {
    const getOrders = async () => {
        const response = await dispatch(ordersActions.fetchOrders({currentPage, sortBy, sortOrder}))
        if (ordersActions.fetchOrders.rejected.match(response)) {
          try {
            await authService.refresh();
            await dispatch(ordersActions.fetchOrders({currentPage, sortBy, sortOrder}))
          } catch (e) {
            return navigate('/login');
          }
        }
      }
    getOrders()
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), sortBy, sortOrder });
  };

  const handleSortChange = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSearchParams({ page: '1', sortBy: field, sortOrder: newSortOrder });
  };

  return (
    <div className={styles.container}>
      <h1>Orders</h1>
      <OrdersTable orders={orders} handleSortChange={handleSortChange} sortBy={sortBy} sortOrder={sortOrder} />
      {error && <div className={styles.error}>Error: {error}</div>}
      <div className={styles.pagination}>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
      </div>
    </div>
  );
};

export default OrdersPage;