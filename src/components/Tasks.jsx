import React, { useState } from 'react';

function Tasks({ tasks, onTaskSubmit }) {
  const [reportId, setReportId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [statusId, setStatusId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onTaskSubmit({
      report_id: reportId,
      employee_id: employeeId,
      status_id: statusId,
    });
    // Clear form inputs
    setReportId('');
    setEmployeeId('');
    setStatusId('');
  };

  return (
    <div className='bg'>
      <h2>Tasks</h2>
      <form onSubmit={handleSubmit}>
        <label>Report ID:</label>
        <input
          type='number'
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          required
        />
        <label>Employee ID:</label>
        <input
          type='number'
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <label>Status ID:</label>
        <input
          type='number'
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
          required
        />
        <button type='submit'>Add Task</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Report ID</th>
            <th>Employee ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.report_id}</td>
              <td>{task.employee_id}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tasks;
