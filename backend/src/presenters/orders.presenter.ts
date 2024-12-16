import {
  IOrderInterface,
  IOrderListQuery,
  IOrderResponse,
  IOrderResponseList,
} from "../interfaces/order.interface";

export class OrdersPresenter {
  public static toResponse(data: IOrderInterface): IOrderResponse {
    return {
      _id: data._id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      age: data.age,
      course: data.course,
      course_format: data.course_format,
      course_type: data.course_type,
      sum: data.sum,
      already_paid: data.already_paid,
      created_at: data.created_at,
      status: data.status,
    };
  }

  public static toResponseList(
    data: IOrderInterface[],
    total: number,
    query: IOrderListQuery,
  ): IOrderResponseList {
    return {
      data: data.map((item) => this.toResponse(item)),
      total,
      ...query,
    };
  }
}
