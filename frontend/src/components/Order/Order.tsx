import React, {FC} from 'react';
import {IOrderModel} from "../../models/IOrderModel";
import {formatDateTime} from "../../_helpers/helpers";

interface IOrderProps {
  order: IOrderModel;
}

const Order: FC<IOrderProps> = ({order}) => {
  return (
    <tr>
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
      <td>{formatDateTime(order.created_at)}</td>
    </tr>
  );
};

export default Order;