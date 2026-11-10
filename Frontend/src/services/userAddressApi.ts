import api from "./api";

export interface UserAddress {
  addressId: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserAddressData {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function getMyAddresses(): Promise<UserAddress[]> {
  const response = await api.get<UserAddress[]>("/Users/GetMyAddresses");

  return response.data;
}

export async function addAddress(data: UserAddressData): Promise<UserAddress> {
  const response = await api.post<UserAddress>("/Users/AddAddress", data);

  return response.data;
}

export async function updateAddress(
  addressId: string,
  data: UserAddressData,
): Promise<UserAddress> {
  const response = await api.put<UserAddress>(
    `/Users/UpdateAddress/${addressId}`,
    data,
  );

  return response.data;
}

export async function deleteAddress(addressId: string): Promise<void> {
  await api.delete(`/Users/DeleteAddress/${addressId}`);
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  await api.patch(`/Users/SetDefaultAddress/${addressId}`);
}
