import React, { useState } from "react";
import { Button, ActionButton, SearchBar, SortBy, Pagination, Select, FormModal, ConfirmModal } from "./index";
import { Add, FilterList, Download, Print } from '@mui/icons-material';
import "../styles/index.css";

const DashboardDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample data
  const [sampleData, setSampleData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", status: "Inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Admin", status: "Active" },
    { id: 6, name: "Diana Davis", email: "diana@example.com", role: "User", status: "Inactive" },
    { id: 7, name: "Edward Miller", email: "edward@example.com", role: "Manager", status: "Active" },
    { id: 8, name: "Fiona Garcia", email: "fiona@example.com", role: "User", status: "Active" },
    { id: 9, name: "George Martinez", email: "george@example.com", role: "Admin", status: "Inactive" },
    { id: 10, name: "Helen Rodriguez", email: "helen@example.com", role: "User", status: "Active" },
  ]);

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "role", label: "Role" },
    { value: "status", label: "Status" },
  ];

  const selectOptions = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
    { value: "guest", label: "Guest" },
  ];

  // Form fields for modal
  const userFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      required: true,
      validation: (value) => {
        if (value.length < 2) return "Name must be at least 2 characters";
        return null;
      }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return null;
      }
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select role",
      required: true,
      options: [
        { value: "admin", label: "Administrator" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
        { value: "guest", label: "Guest" }
      ]
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Select status",
      required: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" }
      ]
    }
  ];

  // Filter and sort data
  const filteredData = sampleData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "" || 
                         (selectedFilter === "active" && item.status === "Active") ||
                         (selectedFilter === "inactive" && item.status === "Inactive");
    return matchesSearch && matchesFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase();
    const bValue = b[sortBy].toLowerCase();
    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSearch = (term, filter) => {
    setSearchTerm(term);
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Modal handlers
  const handleAddUser = (formData) => {
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Math.max(...sampleData.map(u => u.id)) + 1,
        ...formData
      };
      setSampleData([...sampleData, newUser]);
      setShowAddModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleEditUser = (formData) => {
    setLoading(true);
    setTimeout(() => {
      setSampleData(sampleData.map(user => 
        user.id === editingUser.id ? { ...user, ...formData } : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
      setLoading(false);
    }, 1000);
  };

  const handleDeleteUser = () => {
    setLoading(true);
    setTimeout(() => {
      setSampleData(sampleData.filter(user => user.id !== deletingUser.id));
      setShowDeleteModal(false);
      setDeletingUser(null);
      setLoading(false);
    }, 1000);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">User Management Dashboard</h1>
          <p className="dashboard-subtitle">Manage and monitor user accounts</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="primary" 
            size="medium"
            icon={<Add />}
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            icon={<Download />}
            onClick={() => alert("Export clicked!")}
          >
            Export
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            icon={<Print />}
            onClick={() => alert("Print clicked!")}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users by name or email..."
          filters={filterOptions}
          onFilterChange={setSelectedFilter}
        />
        <SortBy
          options={sortOptions}
          value={sortBy}
          order={sortOrder}
          onChange={handleSort}
          label="Sort by:"
        />
        <Select
          options={selectOptions}
          placeholder="Select role..."
          onChange={(selected) => console.log("Role selected:", selected)}
          isMulti={false}
          isClearable={true}
          isSearchable={true}
        />
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: user.status === "Active" ? "#f0f0f0" : "#e0e0e0",
                      color: "#000000",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionButton
                      type="view"
                      onClick={() => alert(`View user: ${user.name}`)}
                      tooltip={`View ${user.name}`}
                    />
                    <ActionButton
                      type="edit"
                      onClick={() => openEditModal(user)}
                      tooltip={`Edit ${user.name}`}
                    />
                    <ActionButton
                      type="delete"
                      onClick={() => openDeleteModal(user)}
                      tooltip={`Delete ${user.name}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="dashboard-footer">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
        />
      </div>

      {/* Add User Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        onSubmit={handleAddUser}
        fields={userFields}
        submitText="Add User"
        loading={loading}
        size="medium"
      />

      {/* Edit User Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
        onSubmit={handleEditUser}
        initialData={editingUser || {}}
        fields={userFields}
        submitText="Update User"
        loading={loading}
        size="medium"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={loading}
      />
    </div>
  );
};

export default DashboardDemo; 