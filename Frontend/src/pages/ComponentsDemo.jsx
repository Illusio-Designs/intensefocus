import React, { useState } from 'react';
import { 
  Toast, 
  ToastContainer, 
  useToast, 
  DatePicker, 
  Table, 
  TableActions,
  Button,
  Modal,
  Select
} from '../components/common';
import '../styles/pages/ComponentsDemo.css';

const ComponentsDemo = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const { toasts, addToast, removeToast, success, error, warning, info } = useToast();

  // Sample table data
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active' },
  ];

  const tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  const tableActions = [
    {
      ...TableActions.VIEW,
      onClick: (row) => {
        info(`Viewing ${row.name}`);
      }
    },
    {
      ...TableActions.EDIT,
      onClick: (row) => {
        warning(`Editing ${row.name}`);
      }
    },
    {
      ...TableActions.DELETE,
      onClick: (row) => {
        error(`Deleting ${row.name}`);
      }
    }
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="components-demo">
      <div className="demo-header">
        <h1>Common Components Demo</h1>
        <p>Showcasing all the reusable components in the application</p>
      </div>

      {/* Toast Demo */}
      <section className="demo-section">
        <h2>Toast Notifications</h2>
        <div className="demo-controls">
          <Button onClick={() => success('Success message!')} variant="success">
            Success Toast
          </Button>
          <Button onClick={() => error('Error message!')} variant="error">
            Error Toast
          </Button>
          <Button onClick={() => warning('Warning message!')} variant="warning">
            Warning Toast
          </Button>
          <Button onClick={() => info('Info message!')} variant="info">
            Info Toast
          </Button>
        </div>
      </section>

      {/* Date Picker Demo */}
      <section className="demo-section">
        <h2>Date Picker</h2>
        <div className="demo-controls">
          <div className="date-picker-demo">
            <label>Select Date:</label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Choose a date"
            />
            {selectedDate && (
              <p className="selected-date">
                Selected: {selectedDate.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Table Demo */}
      <section className="demo-section">
        <h2>Data Table</h2>
        <Table
          data={tableData}
          columns={tableColumns}
          actions={tableActions}
          selectable={true}
          searchable={true}
          sortable={true}
          pageSize={5}
          onSelectionChange={(selected) => {
            console.log('Selected rows:', selected);
          }}
          onRowClick={(row) => {
            info(`Clicked on ${row.name}`);
          }}
        />
      </section>

      {/* Modal Demo */}
      <section className="demo-section">
        <h2>Modal</h2>
        <div className="demo-controls">
          <Button onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
        </div>
      </section>

      {/* Select Demo */}
      <section className="demo-section">
        <h2>Select Component</h2>
        <div className="demo-controls">
          <div className="select-demo">
            <label>Choose an option:</label>
            <Select
              options={selectOptions}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Select an option"
            />
            {selectedOption && (
              <p className="selected-option">
                Selected: {selectedOption}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer position="top-right">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demo Modal"
        size="medium"
      >
        <div className="modal-content">
          <p>This is a demo modal with some content.</p>
          <p>You can put any content here including forms, images, or other components.</p>
          <div className="modal-actions">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => {
              success('Action completed!');
              setIsModalOpen(false);
            }}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComponentsDemo; 