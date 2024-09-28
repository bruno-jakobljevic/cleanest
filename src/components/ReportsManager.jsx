import { useState } from 'react';
import axios from 'axios';
import { getIconByStatus } from '../utils/icons';
import Swal from 'sweetalert2';

const ReportsManager = ({ reports, setReports, statuses, employees }) => {
  const [editedReports, setEditedReports] = useState({});
  const [editingReportId, setEditingReportId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCheckedFilter, setIsCheckedFilter] = useState('all');

  const handleFieldChange = (reportId, field, value) => {
    setEditedReports((prevEditedReports) => ({
      ...prevEditedReports,
      [reportId]: {
        ...prevEditedReports[reportId],
        [field]: value,
      },
    }));
  };

  const handleApplyChanges = async (reportId) => {
    const updatedReport = editedReports[reportId];

    if (updatedReport) {
      const originalReport = reports.find((report) => report.id === reportId);
      const finalReport = {
        ...originalReport,
        ...updatedReport,
      };

      try {
        await axios.put(
          `http://localhost:3001/reports/managerEditReport/${reportId}`,
          {
            status_id: finalReport.status_id,
            employee_id: finalReport.employee_id,
            note: finalReport.note,
            isChecked: finalReport.isChecked,
          }
        );
        const updatedReports = reports.map((report) =>
          report.id === reportId ? finalReport : report
        );
        setReports(updatedReports);
        setEditedReports((prev) => {
          const updated = { ...prev };
          delete updated[reportId];
          return updated;
        });
        setEditingReportId(null);
        Swal.fire({
          text: 'Report edited!',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
      } catch (error) {
        console.error('Error applying changes:', error);
      }
    }
  };

  const handleCancelEdit = (reportId) => {
    setEditedReports((prev) => {
      const updated = { ...prev };
      delete updated[reportId];
      return updated;
    });
    setEditingReportId(null);
    Swal.fire({
      text: 'Canceled!',
      showConfirmButton: false,
      timer: 1500,
      icon: 'success',
    });
  };

  const handleEditReport = (reportId) => {
    setEditingReportId(reportId);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(
        `http://localhost:3001/reports/deleteReport/${reportId}`
      );
      const updatedReports = reports.filter((report) => report.id !== reportId);
      setReports(updatedReports);
      setEditedReports((prev) => {
        const updated = { ...prev };
        delete updated[reportId];
        return updated;
      });
      Swal.fire({
        text: 'Report deleted!',
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const filterReportsByDate = (reports) => {
    const now = new Date();

    return reports.filter((report) => {
      const createdAt = new Date(report.created_at);
      switch (dateFilter) {
        case 'today':
          return createdAt.toDateString() === now.toDateString();
        case 'past_week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return createdAt >= weekAgo;
        case 'past_month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return createdAt >= monthAgo;
        case 'past_year':
          const yearAgo = new Date();
          yearAgo.setFullYear(now.getFullYear() - 1);
          return createdAt >= yearAgo;
        default:
          return true; // all
      }
    });
  };

  const filterReportsByStatus = (reports) => {
    if (statusFilter === 'all') return reports;
    return reports.filter(
      (report) => report.status_id === parseInt(statusFilter)
    );
  };

  const filterReportsByIsChecked = (reports) => {
    if (isCheckedFilter === 'all') return reports;
    return reports.filter((report) => {
      const isCheckedValue = report.isChecked === 1 ? 1 : 0;
      return isCheckedValue == parseInt(isCheckedFilter);
    });
  };

  const filteredReports = filterReportsByStatus(
    filterReportsByDate(filterReportsByIsChecked(reports))
  );

  return (
    <div className='main-container'>
      <div className='filter-controls'>
        <p className='custom-select2'>
          Date:
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='today'>Today</option>
            <option value='past_week'>Past Week</option>
            <option value='past_month'>Past Month</option>
            <option value='past_year'>Past Year</option>
          </select>
        </p>
        <p className='custom-select2'>
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='1'>Pending</option>
            <option value='2'>In Progress</option>
            <option value='3'>Resolved</option>
          </select>
        </p>
        <p className='custom-select2'>
          Certified:
          <select
            value={isCheckedFilter}
            onChange={(e) => setIsCheckedFilter(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='1'>Certified</option>
            <option value='0'>Not Certified</option>
          </select>
        </p>
      </div>

      <ul className='events'>
        {filteredReports.length === 0 ? (
          <p>No reports available for the selected filters.</p>
        ) : (
          filteredReports.map((report) => {
            const editedReport = editedReports[report.id] || {};
            const isEditing = editingReportId === report.id;

            return (
              <li key={report.id} className='card'>
                <p>
                  <strong>Location: </strong>
                  <a
                    href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                    target='_blank'
                  >
                    <span style={{ color: '#ff5722' }}>
                      <i className='fa-solid fa-diamond-turn-right fa-xl'></i>
                    </span>
                  </a>
                </p>
                <p>
                  <strong>User description:</strong>{' '}
                  {report.description || 'No description'}
                </p>
                {report.image_url && (
                  <p>
                    <img
                      className='report-image'
                      src={`http://localhost:3001/${report.image_url}`}
                      alt='Report image'
                    />
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{' '}
                  {isEditing ? (
                    <p className='custom-select'>
                      <select
                        value={editedReport.status_id || report.status_id}
                        onChange={(e) =>
                          handleFieldChange(
                            report.id,
                            'status_id',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </p>
                  ) : (
                    <>
                      <img
                        src={getIconByStatus(report.status_id).options.iconUrl}
                        alt='status-icon'
                        style={{
                          width: '20px',
                          verticalAlign: 'middle',
                          marginRight: '8px',
                        }}
                      />
                      {
                        statuses.find(
                          (status) => status.id === report.status_id
                        )?.name
                      }
                    </>
                  )}
                </p>
                <p>
                  <strong>Manager note: </strong>
                  {isEditing ? (
                    <textarea
                      value={editedReport.note || report.note || ''}
                      onChange={(e) =>
                        handleFieldChange(report.id, 'note', e.target.value)
                      }
                    />
                  ) : (
                    report.note || 'No note'
                  )}
                </p>

                <p>
                  <strong>Assigned Employee: </strong>{' '}
                  {isEditing ? (
                    <p className='custom-select'>
                      <select
                        value={
                          editedReport.employee_id || report.employee_id || ''
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            report.id,
                            'employee_id',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value='' disabled>
                          Select an employee
                        </option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.username}
                          </option>
                        ))}
                      </select>
                    </p>
                  ) : report.employee_id ? (
                    employees.find(
                      (employee) => employee.id === report.employee_id
                    )?.username
                  ) : (
                    'No employee assigned'
                  )}
                </p>
                <p>
                  <strong>Certified: </strong>
                  {isEditing ? (
                    <div className='custom-select'>
                      <select
                        value={editedReport.isChecked || report.isChecked}
                        onChange={(e) =>
                          handleFieldChange(
                            report.id,
                            'isChecked',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value={1}>Certified</option>
                        <option value={0}>Not Certified</option>
                      </select>
                    </div>
                  ) : report.isChecked === 1 ? (
                    <div>
                      <br></br>
                      <span style={{ color: '#ff5722' }}>
                        <i className='fa-solid fa-square-check fa-2xl'></i>
                      </span>
                      <span className='sr-only'>Check mark</span>
                    </div>
                  ) : (
                    <div>
                      <br></br>
                      <span style={{ color: '#ff5722' }}>
                        <i className='fa-solid fa-square-xmark fa-2xl'></i>
                      </span>
                      <span className='sr-only'>X mark</span>
                    </div>
                  )}
                </p>
                {isEditing ? (
                  <div className='container'>
                    <button
                      className='event-button'
                      onClick={() => handleApplyChanges(report.id)}
                    >
                      Apply
                    </button>
                    <button
                      className='event-button'
                      onClick={() => handleCancelEdit(report.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className='event-button'
                    onClick={() => handleEditReport(report.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className='event-button'
                  onClick={() => handleDeleteReport(report.id)}
                >
                  Delete
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default ReportsManager;
