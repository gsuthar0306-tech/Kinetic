import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getStoredAccounts,
  saveStoredAccounts,
  type StoredAccount,
} from "../authStorage";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export function RegisterForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmation: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required("Full name is required.")
        .min(2, "Name must be at least 2 characters."),

      email: Yup.string()
        .email("Enter a valid email address.")
        .required("Email is required."),

      password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .matches(
          passwordRegex,
          "Password must contain uppercase, lowercase, number and special character.",
        ),

      confirmation: Yup.string()
        .required("Please confirm your password.")
        .oneOf([Yup.ref("password")], "Your passwords do not match."),
    }),

    onSubmit: (values) => {
      const name = values.name.trim();
      const email = values.email.trim().toLowerCase();

      const account: StoredAccount = {
        id: crypto.randomUUID(),
        name,
        email,
        password: values.password,
        role: "user" as const,
      };

      const existingAccounts = getStoredAccounts();

      const userExists = existingAccounts.some((user) => user.email === email);

      if (userExists) {
        toast.error("An account with this email already exists.");
        return;
      }

      const updatedAccounts = [...existingAccounts, account];
      saveStoredAccounts(updatedAccounts);

      toast.success("Account created successfully!", {
        description: `Welcome to KINETIC, ${name}.`,
      });

      navigate("/login");
    },
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
      <FieldGroup className="lg:gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Join KINETIC
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Create your account
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Save your favourites and make every checkout quicker.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>

          <Input
            id="name"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-600">{formik.errors.name}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-600">{formik.errors.email}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-600">{formik.errors.password}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmation">Confirm password</FieldLabel>

          <Input
            id="confirmation"
            name="confirmation"
            type="password"
            autoComplete="new-password"
            value={formik.values.confirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.confirmation && formik.errors.confirmation && (
            <p className="text-sm text-red-600">{formik.errors.confirmation}</p>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            Create account
          </Button>
        </Field>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-semibold text-slate-950 underline underline-offset-4"
          >
            Sign in
          </NavLink>
        </p>
      </FieldGroup>
    </form>
  );
}
