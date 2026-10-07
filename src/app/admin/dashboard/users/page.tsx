"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/admin/users");
        const json = await response.json();
        if (json.success) {
          setUsers(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const term = searchQuery.toLowerCase();
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return (
      fullName.includes(term) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term))
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users?id=${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (json.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(json.message);
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">User Management</h1>
        <p className="text-sm text-[#7D736A] mt-1">Manage client accounts, templates, and view their details.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EADBCA] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0E8DC] flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A69B90]" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DFD3C3] bg-[#FCFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B48]/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4A3F37]">
            <thead className="bg-[#FCFAF7] border-b border-[#F0E8DC] text-xs uppercase font-semibold text-[#A69B90]">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Template ID</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[#A69B90]">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#F0E8DC] hover:bg-[#FBF3E4]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#29221D]">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <div>{user.email}</div>
                      <div className="text-xs text-[#7D736A] mt-0.5">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#FBF3E4] text-[#B88737] rounded-lg text-xs font-semibold">
                        {user.template_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/dashboard/users/${user.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5F0] hover:bg-[#EADBCA] text-[#4A3F37] rounded-lg transition-colors text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
