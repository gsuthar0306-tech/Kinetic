import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, type TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";

import { getUsers } from "@/services/userApi";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  number: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface TableParams {
  pagination: {
    current: number;
    pageSize: number;
  };
  sortField?: string;
  sortOrder?: "ascend" | "descend";
}

const AdminAllusers = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });

  const columns: TableProps<User>["columns"] = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
      width: 150,
      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      width: 150,
      sorter: (a, b) => a.lastname.localeCompare(b.lastname),
    },
    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
      width: 160,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "—",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 190,
      render: (value: string) =>
        value ? new Date(value).toLocaleString() : "—",
    },
  ];

  const handleTableChange: TableProps<User>["onChange"] = (
    pagination,
    _filters,
    sorter,
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    const nextSorter = singleSorter as SorterResult<User>;

    setTableParams({
      pagination: {
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
      },
      sortField: nextSorter.field ? String(nextSorter.field) : undefined,
      sortOrder: nextSorter.order ?? undefined,
    });
  };

  const sortedUsers = [...users];

  if (tableParams.sortField && tableParams.sortOrder) {
    const field = tableParams.sortField as keyof User;

    sortedUsers.sort((a, b) => {
      const first = a[field];
      const second = b[field];

      let comparison = 0;

      if (typeof first === "number" && typeof second === "number") {
        comparison = first - second;
      } else {
        comparison = String(first ?? "").localeCompare(String(second ?? ""));
      }

      return tableParams.sortOrder === "ascend" ? comparison : -comparison;
    });
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">All Users</h1>

        <p className="text-red-500">
          Failed to load users. Please check your API and login session.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">All Users</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage registered users.
        </p>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-lg border bg-white">
        <Table<User>
          columns={columns}
          rowKey="id"
          dataSource={sortedUsers}
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            total: users.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}–${range[1]} of ${total} users`,
          }}
          scroll={{
            x: 1650,
            y: "60vh",
          }}
          size="middle"
          bordered
        />
      </div>
    </div>
  );
};

export default AdminAllusers;
