interface Address {
  region: string;
  comuna: string;
}
export interface User {
  firstName: string;
  lastName: string;
  address: Address
}
