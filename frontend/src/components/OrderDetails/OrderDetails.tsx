import React, {FC, useState} from 'react';
import {IOrderModel} from "../../models/IOrderModel";
import {useForm} from "react-hook-form";
import {IComment, ICommentData} from "../../models/ICommentModel";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {ordersService} from "../../services/orders.api.service";
import styles from './OrderDetails.module.css';
import {formatDate} from "../../_helpers/helpers";
import {useSearchParams} from "react-router-dom";
import { ordersActions} from "../../redux/slices/orderSlice";
import ModalEdit from "../ModalEdit/ModalEdit";

interface IOrderDetailsProps {
  order: IOrderModel
}

const OrderDetails: FC<IOrderDetailsProps> = ({order}) => {
  const manager = useAppSelector(state => state.manager.data?.data.surname)
  const {handleSubmit, register, reset} = useForm<IComment>()
  const [comments, setComments] = useState(order.comments);
  const [errorComment, setErrorComment] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const sendComment = async (formData: IComment) => {
    if (order.manager === null || manager === order.manager) {
      if (manager && order._id) {
        const commentData: ICommentData = {
          orderId: order._id,
          comment: formData.comment,
          manager: manager,
          date: new Date().toISOString(),
        };
        try {
          const comments = await ordersService.addCommentToOrder(commentData)
          setComments(comments);
          await dispatch(ordersActions.getOrders({
            page: currentPage,
            sortBy,
            sortOrder,
            ...Object.fromEntries(searchParams.entries())
          }))
          reset();
        } catch (e) {
          console.error('Error sending comment', e);
        }
      }
    } else {
      setErrorComment(true);
      reset();
    }
  }

  const openModal = () => {
    if (order.manager === null || manager === order.manager) {
      setIsModalOpen(true);
    } else {
      setErrorEdit(true);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.detailsBlock}>
      <div className={styles.messageBlock}>
        <p>Message: {(!order.message) ? "null" : order.message}</p>
        <p>UTM: {order.utm}</p>
      </div>
      <div className={styles.commentsContainer}>
        <form onSubmit={handleSubmit(sendComment)}>
          <input type="text" {...register('comment')} placeholder={'Comment'}/>
          <button>Submit</button>
          {errorComment && <div className={styles.error}>It's not your order. You can't add comment</div>}
        </form>
        <div>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p>{comment.comment}</p>
              <div className={styles.commentAuthor}>
                <p>{comment.manager}</p>
                <p>{formatDate(comment.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.editButton}>
        <button type={'button'} onClick={openModal}>Edit</button>
        {errorEdit && <div className={styles.errorEdit}>It's not your order</div>}
      </div>

      {isModalOpen && <ModalEdit order={order} closeModal={closeModal} manager={manager} />}

    </div>
  );
};

export default OrderDetails;