import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { registerUser } from "@/services/authApi";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formik = useFormik({
    initialValues: {
      Firstname: "",
      Lastname: "",
      email: "",
      number: "",
      password: "",
      confirmation: "",
    },

    validateOnBlur: true,

    validationSchema: Yup.object({
      Firstname: Yup.string()
        .trim()
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters."),

      Lastname: Yup.string()
        .trim()
        .required("Last name is required.")
        .min(2, "Last name must be at least 2 characters."),

      email: Yup.string()
        .email("Enter a valid email address.")
        .required("Email is required."),

      number: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number.")
        .required("Number is required."),

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

    onSubmit: async (values) => {
      const Firstname = values.Firstname.trim();
      const Lastname = values.Lastname.trim();
      const email = values.email.trim().toLowerCase();

      try {
        await registerUser({
          Firstname: Firstname,
          Lastname: Lastname,
          Number: values.number.trim(),
          Address: "",
          Email: email,
          Password: values.password,
        });

        toast.success("Account created successfully!", {
          description: `Welcome to KINETIC, ${Firstname} ${Lastname}.`,
        });

        navigate("/login");
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("An account with this email already exists.");
          return;
        }

        toast.error("Registration failed.", {
          description:
            error.response?.data ||
            "Something went wrong while creating your account.",
        });
      }
    },
  });

  const shouldShowError = (field: keyof typeof formik.values) =>
    formik.submitCount > 0 ||
    (formik.touched[field] && Boolean(formik.values[field].trim()));

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

        <div className="flex justify-around gap-3">
          <Field>
            <FieldLabel htmlFor="Firstname">First name</FieldLabel>

            <Input
              id="Firstname"
              name="Firstname"
              placeholder="First name"
              autoComplete="given-name"
              value={formik.values.Firstname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {shouldShowError("Firstname") && formik.errors.Firstname && (
              <p className="text-sm text-red-600">{formik.errors.Firstname}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="Lastname">Last name</FieldLabel>

            <Input
              id="Lastname"
              name="Lastname"
              placeholder="Last name"
              autoComplete="family-name"
              value={formik.values.Lastname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {shouldShowError("Lastname") && formik.errors.Lastname && (
              <p className="text-sm text-red-600">{formik.errors.Lastname}</p>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="number">Number</FieldLabel>

          <Input
            id="number"
            name="number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            placeholder="10-digit mobile number"
            autoComplete="tel-national"
            value={formik.values.number}
            onChange={(event) =>
              formik.setFieldValue(
                "number",
                event.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            onBlur={formik.handleBlur}
          />

          {shouldShowError("number") && formik.errors.number && (
            <p className="text-sm text-red-600">{formik.errors.number}</p>
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

          {shouldShowError("email") && formik.errors.email && (
            <p className="text-sm text-red-600">{formik.errors.email}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <div className="relative w-full">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {shouldShowError("password") && formik.errors.password && (
            <p className="text-sm text-red-600">{formik.errors.password}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmation">Confirm password</FieldLabel>

          <div className="relative w-full">
            <Input
              id="confirmation"
              name="confirmation"
              type={showConfirmation ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.confirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmation((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none"
              aria-label={
                showConfirmation ? "Hide confirmation password" : "Show confirmation password"
              }
            >
              {showConfirmation ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {shouldShowError("confirmation") && formik.errors.confirmation && (
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
