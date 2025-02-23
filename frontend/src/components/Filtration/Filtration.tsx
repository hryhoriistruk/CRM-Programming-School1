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
import {useSearchParams} from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {ordersActions} from "../../redux/slices/orderSlice";

interface AdditionalFilterFields {
  startDate?: string;
  endDate?: string;
  my?: boolean;
}

type FilterFormValues = Partial<IOrderModel> & AdditionalFilterFields;

const Filtration = () => {
  const { register, reset } = useForm<FilterFormValues>();
  const [filters, setFilters] = useState({
    course: '' as CourseEnum | '',
    course_format: '' as CourseFormatEnum | '',
    course_type: '' as CourseTypeEnum | '',
    status: '' as StatusEnum | '',
    group: '',
    startDate: '',
    endDate: '',
    my: false,
  });
  const [searchText, setSearchText] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    age: '',
  });
  const [isReset, setIsReset] = useState(false);
  const [isSearchTextChanged, setIsSearchTextChanged] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {groups} = useAppSelector(state => state.groups)
  const manager = useAppSelector(state => state.manager.data?.data.surname)
  const {orders, totalPages} = useAppSelector(state => state.orders)

  const page = searchParams.get('page') || '1';
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

  useEffect(() => {
    if (isReset) {
      setIsReset(false);
      return;
    }

    const timeout = setTimeout(() => {
      const updatedFilters: Record<string, any> = {
        ...Object.fromEntries(searchParams.entries()),
        page: isSearchTextChanged ? '1' : page,
        sortBy,
        sortOrder,
      };

      Object.entries(searchText).forEach(([key, value]) => {
        if (value.trim()) {
          updatedFilters[key] = value.trim();
        } else {
          delete updatedFilters[key];
        }
      });

      setSearchParams(updatedFilters);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchText, isSearchTextChanged]);

  useEffect(() => {
    const initialSearchText = {
      name: searchParams.get("name") || "",
      surname: searchParams.get("surname") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      age: searchParams.get("age") || "",
    } as typeof searchText;

    setSearchText(initialSearchText);

    const initialFilters = {
      course: (searchParams.get("course") as CourseEnum) || "",
      course_format: (searchParams.get("course_format") as CourseFormatEnum) || "",
      course_type: (searchParams.get("course_type") as CourseTypeEnum) || "",
      status: (searchParams.get("status") as StatusEnum) || "",
      group: searchParams.get("group") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      my: searchParams.get("my") === "true",
    };

    setFilters(initialFilters);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchText((prev) => {
      setIsSearchTextChanged(true);
      return { ...prev, [name]: value };
    });
  };

  const handleFilterChange = (name: string, value: string | boolean) => {
    const updatedFilters: Record<string, any> = {
      ...Object.fromEntries(searchParams.entries()),
      sortBy,
      sortOrder,
    };

    if (name === "my") {
      if (value) {
        updatedFilters[name] = manager || '';
      } else {
        delete updatedFilters[name];
      }
    } else {
      updatedFilters[name] = value ? String(value) : '';
      if (!value) {
        delete updatedFilters[name];
      }
    }

    updatedFilters.page = '1';
    setFilters((prev) => ({ ...prev, [name]: value }));
    setSearchParams(updatedFilters);
  };

  const handleResetFilters = () => {
    setIsReset(true);
    setIsSearchTextChanged(false);

    const defaultParams = {
      page: '1',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setSearchParams(defaultParams);

    setFilters({
      course: '',
      course_format: '',
      course_type: '',
      status: '',
      group: '',
      startDate: '',
      endDate: '',
      my: false,
    });

    setSearchText({
      name: '',
      surname: '',
      email: '',
      phone: '',
      age: '',
    })

    reset()

  };

  const fetchAllData = async () => {
    let allData: any = [];
    let page = 1;

    while (page <= totalPages) {
      await dispatch(ordersActions.getOrders({
        page,
        sortOrder,
        sortBy,
        ...Object.fromEntries(searchParams.entries()),
      }))

      allData = [...allData, ...orders];
      page++;
    }
    return allData;
  };

  const handleDownloadExcel = async () => {

    const filteredOrders = await fetchAllData();
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Filtered Data');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(file, 'filtered_data.xlsx');
  };


  return (
    <form className={styles.filterBlock}>
      <div className={styles.filtersSection}>
        <input
          {...register("name")}
          type="text"
          placeholder="Name"
          className={styles.filterInput}
          value={searchText.name}
          onChange={handleInputChange}
        />
        <input
          {...register("surname")}
          type="text"
          placeholder="Surname"
          className={styles.filterInput}
          value={searchText.surname}
          onChange={handleInputChange}
        />
        <input
          {...register("email")}
          type="text"
          placeholder="Email"
          className={styles.filterInput}
          value={searchText.email}
          onChange={handleInputChange}
        />
        <input
          {...register("phone")}
          type="text"
          placeholder="Phone"
          className={styles.filterInput}
          onChange={handleInputChange}
        />
        <input
          {...register("age")}
          type="number"
          placeholder="Age"
          className={styles.filterInput}
          value={searchText.phone}
          onChange={handleInputChange}
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
          <input {...register("my")}
                 type="checkbox"
                 checked={filters.my || false}
                 onChange={(e) => handleFilterChange("my", e.target.checked)}
          />
          My
        </label>
        <button
          type="button"
          onClick={() => handleResetFilters()}
          className={styles.filterResetButton}
        >
          Reset
        </button>
        <img width="48" height="48" src="https://img.icons8.com/?size=100&id=PkN6QPZ6LsIE&format=png&color=209041" alt="export-excel"
             className={styles.excelIcon} onClick={handleDownloadExcel}
        />
      </div>
    </form>
  );
};


export default Filtration;