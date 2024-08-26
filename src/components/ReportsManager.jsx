import { useState } from 'react';
import axios from 'axios';
import { getIconByStatus } from '../utils/icons';
import Swal from 'sweetalert2';

const ReportsManager = ({ reports, setReports, statuses, employees }) => {
  const [editedReports, setEditedReports] = useState({});
  const [editingReportId, setEditingReportId] = useState(null);

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
          text: "You've successfully edited the report!",
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
      text: 'Canceled',
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
        text: "You've successfully deleted the report!",
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div className='main-container'>
      <ul className='events'>
        {reports.map((report) => {
          const editedReport = editedReports[report.id] || {};
          const isEditing = editingReportId === report.id;

          return (
            <li key={report.id} className='card card-container'>
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
                      statuses.find((status) => status.id === report.status_id)
                        ?.name
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
              {isEditing ? (
                <div className='container'>
                  <button
                    className='event-button'
                    onClick={() => handleApplyChanges(report.id)}
                  >
                    Apply changes
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
        })}
      </ul>
    </div>
  );
};

export default ReportsManager;
