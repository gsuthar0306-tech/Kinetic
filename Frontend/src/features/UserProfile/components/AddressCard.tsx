import { MapPin, Pencil, Star, Trash2, UserRound, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { UserAddress } from "@/services/userAddressApi";

interface AddressCardProps {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (address: UserAddress) => void;
  onSetDefault: (address: UserAddress) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <article
      className={`relative rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        address.isDefault
          ? "border-amber-300 ring-1 ring-amber-300/30"
          : "border-slate-200"
      }`}
    >
      {/* Address label and default badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <MapPin className="h-4 w-4" />
          </span>

          <h3 className="font-semibold text-slate-950">{address.label}</h3>
        </div>

        {address.isDefault && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            <Star className="h-3 w-3 fill-current" />
            Default
          </span>
        )}
      </div>

      {/* Address information */}
      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-2.5">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <p className="text-sm font-medium text-slate-800">
            {address.fullName}
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <p className="text-sm text-slate-600">{address.phone}</p>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <p className="text-sm leading-6 text-slate-600">
            {address.addressLine1}
            {address.addressLine2 && (
              <>
                <br />
                {address.addressLine2}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onEdit(address)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>

        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            onClick={() => onSetDefault(address)}
          >
            <Star className="h-3.5 w-3.5" />
            Set default
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          onClick={() => onDelete(address)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </article>
  );
}
