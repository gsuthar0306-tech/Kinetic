import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { Spin } from "antd";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/features/auth/auth.types";
import { loginUser } from "@/services/authApi";
import React from "react";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Enter a valid email address.")
        .required("Email is required."),
      password: Yup.string().required("Password is required."),
    }),
    onSubmit: async (values) => {
      try {
        const response = await loginUser({
          Email: values.email.trim().toLowerCase(),
          Password: values.password,
        });

        const payload = response?.data ?? response;
        const user = payload?.user ?? payload;

        if (!payload?.token) {
          throw new Error("Login response did not include a token.");
        }

        login({
          token: payload.token,
          refreshToken: payload.refreshToken ?? "",
          user: {
            id: user?.Id ?? user?.id ?? "",
            Firstname: user?.Firstname ?? "",
            Lastname: user?.Lastname ?? "",
            email: (user?.Email ?? user?.email ?? values.email).toLowerCase(),
            role: String(
              user?.Role ?? user?.role ?? "user",
            ).toLowerCase() as UserRole,
          },
        });

        setSpinning(true);
        let ptg = -10;

        const interval = setInterval(() => {
          ptg += 5;
          setPercent(ptg);

          if (ptg > 120) {
            clearInterval(interval);
            setSpinning(false);
            setPercent(0);
          }
        }, 100);

        toast.success("Welcome back!");
        setTimeout(() => {
          if (user?.Role === "Admin" || user?.role === "Admin") {
            navigate("/admin");
          } else navigate("/");
        }, 2500);
      } catch (error: any) {
        toast.error("Login failed.", {
          description:
            error.response?.data ||
            error.message ||
            "Something went wrong while trying to sign in.",
        });
      }
    },
  });

  const shouldShowError = (field: keyof typeof formik.values) =>
    formik.submitCount > 0 ||
    (formik.touched[field] && Boolean(formik.values[field]));

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
        <FieldGroup className="lg:gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Welcome back
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Sign in to KINETIC
            </h1>

            <p className="text-sm leading-6 text-slate-500">
              Continue where you left off and manage your favourites, orders and
              account.
            </p>
          </div>

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

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {shouldShowError("password") && formik.errors.password && (
              <p className="text-sm text-red-600">{formik.errors.password}</p>
            )}
          </Field>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-slate-600">
            New to KINETIC?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create an account
            </NavLink>
          </p>
        </FieldGroup>
      </form>
      {spinning &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
            <Spin percent={percent} size="large" />
          </div>,
          document.body,
        )}
    </>
  );
}
