import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import styles from './ModalEdit.module.css'
import {useForm} from "react-hook-form";
import {IOrderModel, IUpdatedOrder} from "../../models/IOrderModel";
import {groupsService} from "../../services/groups.api.service";
import {IGroupsModel} from "../../models/IGroupsModel";
import {ordersService} from "../../services/orders.api.service";
import {useAppDispatch} from "../../redux/store";
import {useSearchParams} from "react-router-dom";
import {ordersActions} from "../../redux/slices/orderSlice";
import {StatusEnum} from "../../enums/status.enum";
import EnumSelect from "../EnumSelect/EnumSelect";
import {CourseEnum} from "../../enums/course.enum";
import {CourseFormatEnum} from "../../enums/course-format.enum";
import {CourseTypeEnum} from "../../enums/course-type.enum";

interface IOrderDetailsProps {
  order: IOrderModel,
  closeModal: () => void,
  manager?: string
}

const ModalEdit: FC<IOrderDetailsProps> = ({order, closeModal, manager}) => {
  const { register, handleSubmit } = useForm<Partial<IOrderModel>>();
  const [groups, setGroups] = useState<IGroupsModel[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusEnum | ''>(order.status ?? '');
  const [selectedCourse, setSelectedCourse] = useState<CourseEnum | ''>(order.course ?? '');
  const [selectedCourseFormat, setSelectedCourseFormat] = useState<CourseFormatEnum | ''>(order.course_format ?? '');
  const [selectedCourseType, setSelectedCourseType] = useState<CourseTypeEnum | ''>(order.course_type ?? '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const currentPage = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect( () => {
    const getGroups = async () => {
      try {
        const savedGroups = await groupsService.getGroups();
        setGroups(savedGroups);
      } catch (e) {
        console.log(e);
      }
    }

    getGroups();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setErrorMessage('Group name cannot be empty!');
      return;
    }
    if (groups.some((group) => group.group === newGroupName.trim())) {
      setErrorMessage('Group name must be unique!');
      return;
    }
    try {
      const newGroup = await groupsService.addGroup({ group: newGroupName.trim() });
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setSelectedGroup(newGroup.group);
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
        }
        try {
          await ordersService.updateOrder(updatedData);
          await dispatch(ordersActions.getOrders({currentPage, sortBy, sortOrder}))
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
          <div className={styles.field}>
            <label htmlFor="group" className={styles.label}>Group</label>
            {isAddingGroup ? (
              <div className={styles.addGroupContainer}>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter new group name"
                  className={`${styles.input} ${styles.groupInput}`}
                />
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
                  value={selectedGroup}
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
            </div>
            <div className={styles.field}>
              <label htmlFor="surname" className={styles.label}>Surname</label>
              <input {...register('surname')} type="text" className={styles.input} defaultValue={order.surname}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input {...register('email')} type="email" className={styles.input} defaultValue={order.email}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>Phone</label>
              <input {...register('phone')} type="tel" className={styles.input} defaultValue={order.phone}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="age" className={styles.label}>Age</label>
              <input {...register('age')} type="number" className={styles.input} defaultValue={order.age}/>
            </div>
            <EnumSelect
              enumObject={StatusEnum}
              name={'status'}
              label={"Status"}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)} register={register} />
            <div className={styles.field}>
            <label htmlFor="sum" className={styles.label}>Sum</label>
              <input
                {...register('sum')}
                type="number"
                className={styles.input} defaultValue={order.sum ?? undefined}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="already_paid" className={styles.label}>Already Paid</label>
              <input
                {...register('already_paid')}
                type="number"
                className={styles.input}
                defaultValue={order.already_paid ?? undefined}
              />
            </div>
            <EnumSelect
              enumObject={CourseEnum}
              name={'course'}
              label={"Course"}
              value={selectedCourse}
              onChange={(value) => setSelectedCourse(value)} register={register} />
            <EnumSelect
              enumObject={CourseFormatEnum}
              name={'course_format'}
              label={"Course Format"}
              value={selectedCourseFormat}
              onChange={(value) => setSelectedCourseFormat(value)} register={register} />
            <EnumSelect
              enumObject={CourseTypeEnum}
              name={'course_type'}
              label={"Course Type"}
              value={selectedCourseType}
              onChange={(value) => setSelectedCourseType(value)} register={register} />
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