import React, {FC, useState} from 'react';
import {IOrderModel} from "../../models/IOrderModel";
import {formatDateTime} from "../../_helpers/helpers";
import styles from './Order.module.css'
import OrderDetails from "../OrderDetails/OrderDetails";

interface IOrderProps {
  order: IOrderModel;
}

const Order: FC<IOrderProps> = ({order}) => {
  const [isExpended, setIsExpended] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpended(!isExpended);
  }

  return (
    <>
      <tr onClick={toggleExpand}>
        <td>{order._id}</td>
        <td>{order.name}</td>
        <td>{order.surname}</td>
        <td>{order.email}</td>
        <td>{order.phone}</td>
        <td>{order.age}</td>
        <td>{order.course}</td>
        <td>{order.course_format}</td>
        <td>{order.course_type}</td>
        <td>{order.status}</td>
        <td>{order.sum}</td>
        <td>{order.already_paid}</td>
        <td>{order.group}</td>
        <td>{formatDateTime(order.created_at)}</td>
        <td>{order.manager}</td>
      </tr>
      {isExpended && (
        <tr className={styles.orderDetailsRow}>
          <td colSpan={15}>
            <div className={styles.orderDetailsContainer}>
              <OrderDetails order={order} />
            </div>
          </td>
        </tr>
      )}
    </>

  );
};

export default Order;