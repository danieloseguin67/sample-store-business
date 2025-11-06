export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  address?: Address;
  phone?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
