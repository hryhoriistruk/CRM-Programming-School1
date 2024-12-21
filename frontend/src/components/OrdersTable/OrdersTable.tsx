import React, {FC} from 'react';
import {IOrderModel} from "../../models/IOrderModel";
import styles from './OrdersTable.module.css'
import Order from "../Order/Order";

interface IOrdersTableProps {
  orders: IOrderModel[];
  handleSortChange: (field: string) => void;
  sortBy: string;
  sortOrder: string;
}

const OrdersTable: FC<IOrdersTableProps> = ({orders, handleSortChange, sortBy, sortOrder}) => {
  return (
    <table className={styles.table}>
      <thead className={styles.tableHead}>
        <tr>
          <th onClick={() => handleSortChange('id')}>ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('name')}>Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('surname')}>Surname {sortBy === 'surname' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('email')}>Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('phone')}>Phone {sortBy === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('age')}>Age {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('age')}>Course {sortBy === 'course' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('course_format')}>Course_format {sortBy === 'course_format' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('course_type')}>Course_type {sortBy === 'course_type' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('status')}>Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('sum')}>Sum {sortBy === 'sum' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('already_paid')}>Already Paid {sortBy === 'already_paid' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
          <th onClick={() => handleSortChange('created_at')}>Created_at {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
         {orders.map(order => <Order key={order._id} order={order}/>)}
      </tbody>
    </table>
  );
};

export default OrdersTable;