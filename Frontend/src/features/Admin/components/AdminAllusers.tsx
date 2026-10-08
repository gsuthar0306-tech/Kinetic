import { getUsers } from "@/services/userApi";
import { useEffect, useState } from "react";

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

const AdminAllusers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">All Users</h1>

      <div className="max-h-[70vh] overflow-auto rounded-md border">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b bg-muted/80 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.firstname}</td>
                <td className="px-4 py-3">{user.lastname}</td>
                <td className="px-4 py-3">{user.age}</td>
                <td className="px-4 py-3">{user.number}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllusers;
