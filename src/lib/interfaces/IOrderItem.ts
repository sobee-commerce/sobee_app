import {IProduct} from './IProduct';
import {IUser} from './IUser';

export interface IOrderItem {
  _id?: string;
  product?: IProduct | string;
  customer?: string | IUser;
  amount: number;
  price?: number;
  subTotal?: number;
  size?: string;
  color?: string;
}
