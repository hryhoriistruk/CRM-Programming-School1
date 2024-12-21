import React, {useEffect, useState} from 'react';
import {ordersService} from "../../services/orders.api.service";
import {useNavigate, useSearchParams} from "react-router-dom";
import {AxiosError} from "axios";
import {authService} from "../../services/auth.api.service";
import {IOrderModel} from "../../models/IOrderModel";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import Pagination from "../../components/Pagination/Pagination";
import styles from './Orders.module.css'

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrderModel[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await ordersService.getOrders(currentPage, sortBy, sortOrder)
        if (response) {
          setOrders(response.data)
          setTotalPages(Math.ceil(response.total / (response.limit || 25)))
        }
      } catch (e) {
        const axiosError = e as AxiosError;
        if (axiosError && axiosError?.response?.status === 401) {
          try {
            await authService.refresh();
          } catch (e) {
            return navigate('/login');
          }

          const response = await ordersService.getOrders(currentPage, sortBy, sortOrder)
          if (response) {
            setOrders(response.data)
          }
        }
      }
    }

    getOrders()

  }, [currentPage, sortBy, sortOrder]);

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
      <div className={styles.pagination}>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
      </div>
    </div>
  );
};

export default OrdersPage;