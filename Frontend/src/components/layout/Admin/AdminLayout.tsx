import type { SideNavbarItem } from "@/components/layout/User/UserSidebar";
import React from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { AdminNavbar } from "@/features/Admin/components/AdminNavbar";
import {
  ChartNoAxesCombined,
  LayoutGrid,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import SinghOut from "@/components/subComponents/SinghOut";

const { Content, Footer, Sider } = Layout;

const SideNavbarLinks: SideNavbarItem[] = [
  {
    label: "DashBoard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "AllUsers",
    href: "/admin/allusers",
    icon: Users,
  },
  {
    label: "Orders",
    href: "/admin/order",
    icon: ShoppingBag,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Settings",
    href: "/admin/setting",
    icon: Settings,
  },
];

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const menuItems = SideNavbarLinks.map((link) => ({
    key: link.href,
    label: link.label,
    icon: React.createElement(link.icon as React.ComponentType),
  }));

  return (
    <Layout className="h-[100vh]">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <section className="flex flex-col justify-between h-full !bg-[#EFF4FF]">
          <div>
            <div className="flex h-16 items-center justify-center">
              <span className="text-lg font-black tracking-[0.16em] ">
                KINETIC
              </span>
            </div>{" "}
            <Menu
              className="!bg-[#EFF4FF] !border-0"
              theme="light"
              mode="inline"
              defaultSelectedKeys={["4"]}
              items={menuItems}
              onClick={({ key }) => {
                navigate(key);
              }}
            />
          </div>
          <div className="text-center p-3">
            <SinghOut />
          </div>
        </section>
      </Sider>
      <Layout>
        <AdminNavbar />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{currentYear} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
