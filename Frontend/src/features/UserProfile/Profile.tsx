import {
  ArrowUpRight,
  Heart,
  MapPin,
  Package,
  Plus,
  Settings2,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Modal } from "antd";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import SinghOut from "@/components/subComponents/SinghOut";
import { formatRupees } from "@/services/products";

import {
  addAddress,
  deleteAddress,
  getMyAddresses,
  setDefaultAddress,
  updateAddress,
  type UserAddress,
  type UserAddressData,
} from "@/services/userAddressApi";

import { AddressCard } from "./components/AddressCard";

const emptyAddress: UserAddressData = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressDraft, setAddressDraft] =
    useState<UserAddressData>(emptyAddress);

  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    setIsLoadingAddresses(true);

    try {
      const data = await getMyAddresses();
      setAddresses(data);
    } catch {
      toast.error("Failed to load your addresses.");
    } finally {
      setIsLoadingAddresses(false);
    }
  }

  function openAddAddress() {
    setEditingAddress(null);
    setAddressDraft(emptyAddress);
    setAddressModalOpen(true);
  }

  function openEditAddress(address: UserAddress) {
    setEditingAddress(address);

    setAddressDraft({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });

    setAddressModalOpen(true);
  }

  function closeAddressModal() {
    setAddressModalOpen(false);
    setEditingAddress(null);
    setAddressDraft(emptyAddress);
  }

  function updateAddressField(field: keyof UserAddressData, value: string) {
    const nextValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setAddressDraft((current) => ({
      ...current,
      [field]: nextValue,
    }));
  }

  async function handleSaveAddress() {
    const requiredFields: (keyof UserAddressData)[] = [
      "label",
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    const missingField = requiredFields.some(
      (field) => !addressDraft[field]?.trim(),
    );

    if (missingField) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(addressDraft.phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSavingAddress(true);

    const data: UserAddressData = {
      ...addressDraft,
      label: addressDraft.label.trim(),
      fullName: addressDraft.fullName.trim(),
      phone: addressDraft.phone.trim(),
      addressLine1: addressDraft.addressLine1.trim(),
      addressLine2: addressDraft.addressLine2?.trim() || null,
      city: addressDraft.city.trim(),
      state: addressDraft.state.trim(),
      postalCode: addressDraft.postalCode.trim(),
      country: addressDraft.country.trim(),
    };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.addressId, data);
        toast.success("Address updated successfully.");
      } else {
        await addAddress(data);
        toast.success("Address added successfully.");
      }

      closeAddressModal();
      await loadAddresses();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: string } })?.response?.data ||
          "Something went wrong while saving the address.",
      );
    } finally {
      setIsSavingAddress(false);
    }
  }

  async function handleDeleteAddress(address: UserAddress) {
    try {
      await deleteAddress(address.addressId);
      toast.success("Address deleted successfully.");
      await loadAddresses();
    } catch {
      toast.error("Failed to delete address.");
    }
  }

  async function handleSetDefaultAddress(address: UserAddress) {
    try {
      await setDefaultAddress(address.addressId);
      toast.success("Default address updated.");
      await loadAddresses();
    } catch {
      toast.error("Failed to update default address.");
    }
  }

  const addressFields: {
    key: keyof UserAddressData;
    label: string;
    placeholder: string;
    required?: boolean;
  }[] = [
    {
      key: "label",
      label: "Address label",
      placeholder: "Home, Work, etc.",
      required: true,
    },
    {
      key: "fullName",
      label: "Full name",
      placeholder: "Recipient name",
      required: true,
    },
    {
      key: "phone",
      label: "Phone number",
      placeholder: "10-digit mobile number",
      required: true,
    },
    {
      key: "addressLine1",
      label: "Address line 1",
      placeholder: "House no., street, area",
      required: true,
    },
    {
      key: "addressLine2",
      label: "Address line 2",
      placeholder: "Landmark (optional)",
    },
    {
      key: "city",
      label: "City",
      placeholder: "City",
      required: true,
    },
    {
      key: "state",
      label: "State",
      placeholder: "State",
      required: true,
    },
    {
      key: "postalCode",
      label: "Postal code",
      placeholder: "PIN code",
      required: true,
    },
    {
      key: "country",
      label: "Country",
      placeholder: "Country",
      required: true,
    },
  ];

  if (user?.role !== "user") {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
          <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 sm:text-xs">
            Account overview
          </p>
          <h1 className="mt-0.5 truncate text-base font-semibold tracking-tight text-slate-900 sm:text-xl">
            Welcome back, {user.Firstname} {user.Lastname}
          </h1>
          <p className="truncate text-xs text-slate-500 sm:text-sm">
            {user.email}
          </p>
        </div>
        <SinghOut className="h-8 shrink-0 border-red-600 bg-transparent px-2 text-xs text-red-500 shadow-md hover:bg-red-500 hover:font-bold hover:text-white sm:px-3" />
      </section>

      <section
        id="personal-information"
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Personal information
            </h2>
            <p className="text-xs text-slate-500">
              Your account details at a glance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/profile/setting&password")}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Account settings</span>
            <span className="sm:hidden">Settings</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "First name", value: user.Firstname },
            { label: "Last name", value: user.Lastname },
            { label: "Email address", value: user.email },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="min-w-0 rounded-lg bg-slate-50 px-3 py-2.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-slate-900 sm:text-sm">
                {value || "Not provided"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Account summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          {
            label: "Bag & cart",
            value: `${cartCount} items`,
            detail: formatRupees(cartTotal),
            icon: ShoppingBag,
            action: () => navigate("/profile/cart"),
          },
          {
            label: "Wishlist",
            value: `${favorites.length} items`,
            detail: "Saved for later",
            icon: Heart,
            action: () => navigate("/profile/favorites"),
          },
          {
            label: "Addresses",
            value: `${addresses.length} saved`,
            detail: "Delivery locations",
            icon: MapPin,
            action: () =>
              document
                .getElementById("addresses")
                ?.scrollIntoView({ behavior: "smooth" }),
          },
          {
            label: "Orders",
            value: "Order history",
            detail: "View your orders",
            icon: Package,
            action: () => navigate("/profile/order"),
          },
        ].map(({ label, value, detail, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                  {label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {value}
                </p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
              {detail}
            </p>
          </button>
        ))}
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <section
          id="addresses"
          className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Saved addresses
              </h2>
              <p className="text-xs text-slate-500">
                Manage your delivery locations.
              </p>
            </div>
            <Button
              size="sm"
              onClick={openAddAddress}
              disabled={addresses.length >= 2 || isLoadingAddresses}
              className="h-8 shrink-0 gap-1 px-2 text-xs sm:px-3"
            >
              <Plus className="h-3.5 w-3.5" />
              Add address
            </Button>
          </div>

          {isLoadingAddresses ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
              Loading your addresses...
            </p>
          ) : addresses.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm font-medium text-slate-800">
                No saved addresses
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Add an address to speed up your next checkout.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.addressId}
                  address={address}
                  onEdit={openEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              ))}
            </div>
          )}
          {!isLoadingAddresses && addresses.length >= 2 && (
            <p className="mt-3 text-[11px] text-slate-500">
              You have reached the maximum of two saved addresses.
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Quick favorites
              </h2>
              <p className="text-xs text-slate-500">
                {favorites.length} saved items
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/profile/favorites")}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {favorites.length === 0 ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-5 text-center text-xs text-slate-500">
              Your wishlist is empty. Save products to see them here.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {favorites.slice(0, 3).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex w-full min-w-0 items-center gap-3 rounded-lg bg-slate-50 p-2 text-left transition hover:bg-blue-50"
                >
                  <img
                    src={product.thumbnail}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-md border border-slate-100 bg-white object-contain p-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-900">
                      {product.title}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-700">
                      {formatRupees(product.price)}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        title={editingAddress ? "Edit address" : "Add delivery address"}
        open={addressModalOpen}
        onCancel={closeAddressModal}
        footer={null}
        destroyOnHidden
        centered
      >
        <p className="mb-5 text-sm text-slate-500">
          Enter the details for your delivery location.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {addressFields.map((field) => (
            <label
              key={field.key}
              className={
                field.key === "addressLine1" || field.key === "addressLine2"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <span className="mb-1.5 block text-xs font-medium text-slate-600">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-rose-500">*</span>
                )}
              </span>

              <input
                type={field.key === "phone" ? "tel" : "text"}
                inputMode={field.key === "phone" ? "numeric" : undefined}
                maxLength={field.key === "phone" ? 10 : undefined}
                pattern={field.key === "phone" ? "[6-9][0-9]{9}" : undefined}
                value={addressDraft[field.key] ?? ""}
                onChange={(event) =>
                  updateAddressField(field.key, event.target.value)
                }
                placeholder={field.placeholder}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={closeAddressModal}>
            Cancel
          </Button>

          <Button
            onClick={handleSaveAddress}
            disabled={isSavingAddress}
            className="gap-2"
          >
            {isSavingAddress
              ? "Saving..."
              : editingAddress
                ? "Update address"
                : "Save address"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
