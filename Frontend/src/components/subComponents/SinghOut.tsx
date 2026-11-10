import { useState } from "react";
import { Popconfirm, Spin } from "antd";
import type { PopconfirmProps } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createPortal } from "react-dom";

interface SinghOutProps {
  className?: string;
}

const SinghOut = ({ className }: SinghOutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [percent, setPercent] = useState(0);

  const showProgress = async () => {
    setSpinning(true);
    setPercent(0);
    const startedAt = performance.now();

    await new Promise<void>((resolve) => {
      const interval = window.setInterval(() => {
        const nextPercent = Math.min(
          100,
          Math.floor(((performance.now() - startedAt) / 2400) * 100),
        );
        setPercent(nextPercent);

        if (nextPercent === 100) {
          window.clearInterval(interval);
          resolve();
        }
      }, 30);
    });

    setSpinning(false);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  };

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    await showProgress();

    try {
      await logout();
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Your session was cleared, but sign out could not reach the server.");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <Popconfirm
        title="LOG OUT"
        description="Are you sure you want to log out?"
        onConfirm={confirm}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button
          type="button"
          variant="outline"
          disabled={spinning}
          className={
            className ??
            "h-10 w-full border-red-600 bg-transparent text-red-500 shadow-md hover:bg-red-500 hover:font-bold hover:text-white"
          }
        >
          Sign out
        </Button>
      </Popconfirm>
      <AnimatePresence>
        {spinning &&
          createPortal(
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              role="status"
              aria-live="polite"
            >
              <Spin percent={percent} size="large" />
            </motion.div>,
            document.body,
          )}
      </AnimatePresence>
    </>
  );
};

export default SinghOut;
