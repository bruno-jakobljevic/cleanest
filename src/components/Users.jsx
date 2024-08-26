import { useEffect, useState } from 'react';

const Users = ({ users, employees, reports }) => {
  const [userReports, setUserReports] = useState({});
  const [employeeTasks, setEmployeeTasks] = useState({});
  const [employeeResolved, setEmployeeResolved] = useState({});

  useEffect(() => {
    const userReportsCount = {};
    const employeeTasksCount = {};
    const employeeResolvedCount = {};

    reports.forEach((report) => {
      if (report.user_id) {
        if (!userReportsCount[report.user_id]) {
          userReportsCount[report.user_id] = 0;
        }
        userReportsCount[report.user_id] += 1;
      }

      if (report.employee_id && report.status_id <= 2) {
        if (!employeeTasksCount[report.employee_id]) {
          employeeTasksCount[report.employee_id] = 0;
        }
        employeeTasksCount[report.employee_id] += 1;
      }

      if (report.status_id === 3) {
        if (!employeeResolvedCount[report.employee_id]) {
          employeeResolvedCount[report.employee_id] = 0;
        }
        employeeResolvedCount[report.employee_id] += 1;
      }
    });

    setUserReports(userReportsCount);
    setEmployeeTasks(employeeTasksCount);
    setEmployeeResolved(employeeResolvedCount);
  }, [reports]);

  return (
    <div>
      <h1>Users</h1>
      <table className='users'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Last Login</th>
            <th>Reports Submitted</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.last_login}</td>
              <td>
                {userReports[user.id] !== undefined ? userReports[user.id] : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Employees</h1>
      <table className='users'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Last Login</th>
            <th>Assigned Reports</th>
            <th>Resolved Reports</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.email}</td>
              <td>{employee.username}</td>
              <td>{employee.last_login}</td>
              <td>
                {employeeTasks[employee.id] !== undefined
                  ? employeeTasks[employee.id]
                  : 0}
              </td>
              <td>
                {employeeResolved[employee.id] !== undefined
                  ? employeeResolved[employee.id]
                  : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
