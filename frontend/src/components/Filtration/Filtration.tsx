import React, {useEffect, useState} from 'react';
import styles from './Filtration.module.css'
import {useForm} from "react-hook-form";
import {IOrderModel} from "../../models/IOrderModel";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {groupsActions} from "../../redux/slices/groupsSlice";
import {StatusEnum} from "../../enums/status.enum";
import {CourseEnum} from "../../enums/course.enum";
import {CourseFormatEnum} from "../../enums/course-format.enum";
import {CourseTypeEnum} from "../../enums/course-type.enum";
import EnumSelect from "../EnumSelect/EnumSelect";
import {ordersActions} from "../../redux/slices/orderSlice";
import {useSearchParams} from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {styled, TextField} from "@mui/material";

interface AdditionalFilterFields {
  startDate?: string;
  endDate?: string;
  my?: boolean;
}

type FilterFormValues = Partial<IOrderModel> & AdditionalFilterFields;

const Filtration = ({ onFilterChange }: { onFilterChange: (filters: Record<string, any>) => void }) => {
  const { register, reset, watch } = useForm<FilterFormValues>();
  const watchFields = watch();
  const [filters, setFilters] = useState({
    course: '' as CourseEnum | '',
    course_format: '' as CourseFormatEnum | '',
    course_type: '' as CourseTypeEnum | '',
    status: '' as StatusEnum | '',
    group: '',
    startDate: '',
    endDate: '',
  });
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {groups} = useAppSelector(state => state.groups)

  const page = Number(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect( () => {
    const getGroups = async () => {
      try {
        dispatch(groupsActions.fetchGroups())
      } catch (e) {
        console.log(e)
      }
    }
    getGroups()
  }, [dispatch]);

  const handleFilterChange = (name: string, value: string) => {
    const updatedFilters = {
      ...Object.fromEntries(searchParams.entries()),
      [name]: value,
      page: '1',
      sortBy,
      sortOrder,
    };

    setFilters((prev) => ({ ...prev, [name]: value }));
    setSearchParams(updatedFilters);
    dispatch(ordersActions.getOrders({
      ...updatedFilters,
      page: Number(updatedFilters.page),
    }));
  };

  const handleBlur = () => {
    const filters = Object.entries(watchFields).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const defaultParams = {
      page: '1',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };

    setFilters({
      course: '',
      course_format: '',
      course_type: '',
      status: '',
      group: '',
      startDate: '',
      endDate: '',
    });
    reset()
    setSearchParams(defaultParams);

    dispatch(ordersActions.getOrders({
      ...defaultParams,
      page: Number(defaultParams.page),
    }));
  };

  return (
    <form className={styles.filterBlock}>
      <div className={styles.filtersSection}>
        <input
          {...register("name")}
          type="text"
          placeholder="Name"
          className={styles.filterInput}
          onBlur={handleBlur}
        />
        <input
          {...register("surname")}
          type="text"
          placeholder="Surname"
          className={styles.filterInput}
          onBlur={handleBlur}
        />
        <input
          {...register("email")}
          type="text"
          placeholder="Email"
          className={styles.filterInput}
          onBlur={handleBlur}
        />
        <input
          {...register("phone")}
          type="text"
          placeholder="Phone"
          className={styles.filterInput}
          onBlur={handleBlur}
        />
        <input
          {...register("age")}
          type="number"
          placeholder="Age"
          className={styles.filterInput}
          onBlur={handleBlur}
        />
        <EnumSelect
          enumObject={CourseEnum}
          name={'course'}
          value={filters.course}
          onChange={(value) => handleFilterChange("course", value)}
          register={register}
          defaultText="All courses"
          className={styles.filterSelect}
        />
        <EnumSelect
          enumObject={CourseFormatEnum}
          name={'course_format'}
          value={filters.course_format}
          onChange={(value) => handleFilterChange("course_format", value)}
          register={register}
          defaultText={'All formats'}
          className={styles.filterSelect}
        />
        <EnumSelect
          enumObject={CourseTypeEnum}
          name={'course_type'}
          value={filters.course_type}
          onChange={(value) => handleFilterChange("course_type", value)}
          register={register}
          defaultText={'All types'}
          className={styles.filterSelect}
        />
        <EnumSelect
          enumObject={StatusEnum}
          name={'status'}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          register={register}
          defaultText={'All status'}
          className={styles.filterSelect}
        />
        <select
          {...register('group')}
          value={filters.group}
          onChange={(e) => handleFilterChange("group", e.target.value)}
          className={styles.filterSelect}
        >
          <option value="" disabled>
            All groups
          </option>
          {groups.map((group) => (
            <option key={group.group} value={group.group}>
              {group.group}
            </option>
          ))}
        </select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={filters.startDate ? dayjs(filters.startDate, 'YYYY-MM-DD') : null}
            onChange={(date) => handleFilterChange("startDate", date ? date.format('YYYY-MM-DD') : '')}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                sx: {
                  backgroundColor: '#fff',
                  width: 'calc(100% - 10px)',
                }
              }
            }}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate ? dayjs(filters.endDate, 'YYYY-MM-DD') : null}
            onChange={(date) => handleFilterChange("endDate", date ? date.format('YYYY-MM-DD') : '')}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                sx: {
                  backgroundColor: '#fff',
                  width: 'calc(100% - 10px)',
                }
              }
            }}
          />
        </LocalizationProvider>

      </div>
      <div className={styles.filterActions}>
        <label className={styles.filterCheckbox}>
          <input {...register("my")} type="checkbox"/>
          My
        </label>
        <button
          type="button"
          onClick={() => handleResetFilters()}
          className={styles.filterResetButton}
        >
          Reset
        </button>
      </div>
    </form>
  );
};


export default Filtration;