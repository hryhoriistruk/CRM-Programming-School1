import React, { FC, useState} from 'react';
import styles from './ModalEdit.module.css'
import {useForm} from "react-hook-form";
import {IOrderModel, IUpdatedOrder} from "../../models/IOrderModel";
import {ordersService} from "../../services/orders.api.service";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {useSearchParams} from "react-router-dom";
import {ordersActions} from "../../redux/slices/orderSlice";
import {StatusEnum} from "../../enums/status.enum";
import EnumSelect from "../EnumSelect/EnumSelect";
import {CourseEnum} from "../../enums/course.enum";
import {CourseFormatEnum} from "../../enums/course-format.enum";
import {CourseTypeEnum} from "../../enums/course-type.enum";
import {joiResolver} from "@hookform/resolvers/joi";
import {orderValidator} from "../../validator/order.validator";
import {groupsActions} from "../../redux/slices/groupsSlice";

interface IOrderDetailsProps {
  order: IOrderModel,
  closeModal: () => void,
  manager?: string
}

const ModalEdit: FC<IOrderDetailsProps> = ({order, closeModal, manager}) => {
  const { register, handleSubmit, formState: {errors} }
    = useForm<Partial<IOrderModel>>({resolver: joiResolver(orderValidator)});

  const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusEnum | ''>(order.status ?? '');
  const [selectedCourse, setSelectedCourse] = useState<CourseEnum | ''>(order.course ?? '');
  const [selectedCourseFormat, setSelectedCourseFormat] = useState<CourseFormatEnum | ''>(order.course_format ?? '');
  const [selectedCourseType, setSelectedCourseType] = useState<CourseTypeEnum | ''>(order.course_type ?? '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const {groups} = useAppSelector(state => state.groups)

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setErrorMessage('Group name cannot be empty!');
      return;
    }
    if (newGroupName.trim().length < 4 || newGroupName.trim().length > 20) {
      setErrorMessage('Group name cannot be less 4 chars or more 20 chars');
      return;
    }
    if (groups.some((group) => group.group === newGroupName.trim())) {
      setErrorMessage('Group name must be unique!');
      return;
    }
    try {
      dispatch(groupsActions.addGroup(newGroupName))
      setNewGroupName('');
      setIsAddingGroup(false);
      setErrorMessage('');
    } catch (e) {
      console.error('Error adding group:', e);
      setErrorMessage('Failed to add group. Please try again.');
    }
  };

  const handleSelectGroup = () => {
    setIsAddingGroup(false);
    setErrorMessage('');
  };

  const updateOrder = async (formData: Partial<IOrderModel>)=> {
    if (order.manager === null || manager === order.manager) {
      if (order._id) {
        const updatedData: IUpdatedOrder = {
          orderId: order._id,
          name: formData.name ?? "",
          surname: formData.surname ?? "",
          group: formData.group ?? null,
          status: formData.status ?? null,
          sum: formData.sum ?? null,
          already_paid: formData.already_paid ?? null,
          email: formData.email ?? "",
          course: formData.course ?? null,
          phone: formData.phone ?? "",
          course_format: formData.course_format ?? null,
          age: formData.age ?? 0,
          course_type: formData.course_type ?? null,
          manager: manager ?? null,
        }
        try {
          await ordersService.updateOrder(updatedData);
          await dispatch(ordersActions.getOrders({
            page: currentPage,
            sortBy,
            sortOrder,
            ...Object.fromEntries(searchParams.entries())
          }))
          closeModal();
        } catch (e) {
          console.error('Error update order', e);
        }
      }

    }
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit(updateOrder)} className={styles.form}>
          <div>
            <label htmlFor="group" className={styles.label}>Group</label>
            {isAddingGroup ? (
              <div className={styles.addGroupContainer}>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter new group name"
                  className={`${styles.input} ${styles.groupInput}`} />
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddGroup}
                >
                  Add Group
                </button>
                <button
                  type="button"
                  className={styles.selectButton}
                  onClick={handleSelectGroup}
                >
                  Select
                </button>
              </div>
            ) : (
              <div className={styles.selectGroupContainer}>
                <select
                  {...register('group')}
                  value={selectedGroup ? selectedGroup : order.group || ''}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className={`${styles.select} ${styles.groupSelect}`}
                >
                  <option value="" disabled>
                    Select group
                  </option>
                  {groups.map((group) => (
                    <option key={group.group} value={group.group}>
                      {group.group}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => setIsAddingGroup(true)}
                >
                  Add Group
                </button>
              </div>
            )}
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input {...register('name')} type="text" className={styles.input} defaultValue={order.name}/>
              {errors.name && <div className={styles.error}>{errors.name.message}</div>}
            </div>
            <div>
              <label htmlFor="surname" className={styles.label}>Surname</label>
              <input {...register('surname')} type="text" className={styles.input} defaultValue={order.surname}/>
              {errors.surname && <div className={styles.error}>{errors.surname.message}</div>}
            </div>
            <div>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input {...register('email')} type="email" className={styles.input} defaultValue={order.email}/>
              {errors.email && <div className={styles.error}>{errors.email.message}</div>}
            </div>
            <div>
              <label htmlFor="phone" className={styles.label}>Phone</label>
              <input {...register('phone')} type="tel" className={styles.input} defaultValue={order.phone}/>
              {errors.phone && <div className={styles.error}>{errors.phone.message}</div>}
            </div>
            <div>
              <label htmlFor="age" className={styles.label}>Age</label>
              <input {...register('age')} type="number" className={styles.input} defaultValue={order.age}/>
              {errors.age && <div className={styles.error}>{errors.age.message}</div>}
            </div>
            <EnumSelect
              enumObject={StatusEnum}
              label={"Status"}
              name={'status'}
              value={selectedStatus}
              className={styles.select}
              onChange={(value) => setSelectedStatus(value)} register={register}
              defaultText={'Select status'}
            />
            <div>
            <label htmlFor="sum" className={styles.label}>Sum</label>
              <input
                {...register('sum')}
                type="number"
                className={styles.input}
                defaultValue={order.sum ?? undefined}/>
                {errors.sum && <div className={styles.error}>{errors.sum.message}</div>}
            </div>
            <div>
              <label htmlFor="already_paid" className={styles.label}>Already Paid</label>
              <input
                {...register('already_paid')}
                type="number"
                className={styles.input}
                defaultValue={order.already_paid ?? undefined} />
              {errors.already_paid && <div className={styles.error}>{errors.already_paid.message}</div>}
            </div>
            <EnumSelect
              enumObject={CourseEnum}
              name={'course'}
              label={"Course"}
              value={selectedCourse}
              className={styles.select}
              onChange={(value) => setSelectedCourse(value)} register={register}
              defaultText={'Select course'} />
            <EnumSelect
              enumObject={CourseFormatEnum}
              name={'course_format'}
              label={"Course Format"}
              value={selectedCourseFormat}
              className={styles.select}
              onChange={(value) => setSelectedCourseFormat(value)} register={register}
              defaultText={'Select course format'}
            />
            <EnumSelect
              enumObject={CourseTypeEnum}
              name={'course_type'}
              label={"Course Type"}
              value={selectedCourseType}
              className={styles.select}
              onChange={(value) => setSelectedCourseType(value)} register={register}
              defaultText={'Select course type'}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.closeButton} onClick={closeModal}>
              Close
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;