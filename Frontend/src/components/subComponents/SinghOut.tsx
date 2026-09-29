import React from "react";
import { Popconfirm, type PopconfirmProps } from "antd";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Spin } from "antd";
import { useAuth } from "@/context/AuthContext";

const SinghOut = () => {
  const { logout } = useAuth();

  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const navigate = useNavigate();
  const confirm: PopconfirmProps["onConfirm"] = () => {
    toast.success("Signed OUT successfully");
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

    setTimeout(() => {
      navigate("/login");
      logout();
    }, 2500);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    toast.error("Click on No");
  };
  return (
    <>
      <Popconfirm
        title="LOG OUT"
        description="Are you sure want to log out?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button
          variant="outline"
          className="w-full h-10 border-red-600 bg-transparent shadow-md text-red-500 hover:text-white hover:font-bold hover:bg-red-500"
        >
          Sign out
        </Button>
        <Spin spinning={spinning} percent={percent} fullscreen />
      </Popconfirm>
    </>
  );
};

export default SinghOut;
