import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {authService} from "../../services/auth.api.service";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import Pagination from "../../components/Pagination/Pagination";
import styles from './Orders.module.css'
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ordersActions} from "../../redux/slices/orderSlice";
import Filtration from "../../components/Filtration/Filtration";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const {orders, totalPages, error} = useAppSelector(state => state.orders);

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const queryFilters = useMemo(() => {
    const filters = Object.fromEntries(searchParams.entries());
    delete filters.page;
    return filters;
  }, [searchParams]);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      setSearchParams({ page: String(currentPage), sortBy: sortBy, sortOrder: sortOrder });
      isFirstLoad.current = false;
    }

    const getOrders = async () => {
      const response = await dispatch(
        ordersActions.getOrders({
          page: currentPage,
          sortBy,
          sortOrder,
          ...queryFilters,
        })
      );
      if (ordersActions.getOrders.rejected.match(response)) {
        const errorMessage = response.payload;

        if (errorMessage === "Orders not found") {
          dispatch(ordersActions.clearOrders());
          return;
        }

        try {
          await authService.refresh();
          await dispatch(
            ordersActions.getOrders({
              page: currentPage,
              sortBy,
              sortOrder,
              ...queryFilters,
            })
          );
        } catch (e) {
          return navigate("/login");
        }
      }
    };
    getOrders();
  }, [dispatch, currentPage, sortBy, sortOrder, queryFilters, navigate]);

  const updateSearchParams = (newParams: Record<string, string>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });
      return params;
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({page: page.toString()})
  };

  const handleSortChange = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    updateSearchParams({ sortBy: field, sortOrder: newSortOrder, page: "1" });
  };

  return (
    <div className={styles.container}>
      <Filtration
        onFilterChange={(filters) => {
          updateSearchParams({ ...filters, page: "1" });
        }}
      />
      <OrdersTable orders={orders} handleSortChange={handleSortChange} sortBy={sortBy} sortOrder={sortOrder} />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.pagination}>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
      </div>
    </div>
  );
};

export default OrdersPage;