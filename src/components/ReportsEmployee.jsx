import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getIconByStatus } from '../utils/icons';
import Swal from 'sweetalert2';

const ReportsEmployee = ({ reports, setReports, statuses, decoded }) => {
  const userId = decoded.user_id;
  const [employeeReports, setEmployeeReports] = useState([]);
  const [editingReportId, setEditingReportId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchEmployeeReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/reports/employeeReports/${userId}`
        );
        setEmployeeReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchEmployeeReports();
  }, []);

  const handleEditClick = (reportId, currentStatusId) => {
    setEditingReportId(reportId);
    setSelectedStatus(currentStatusId);
  };

  const handleCancelClick = () => {
    setEditingReportId(null);
    setSelectedStatus(null);
  };

  const handleApplyClick = async (reportId) => {
    try {
      await axios.put(
        `http://localhost:3001/reports/employeeEditReport/${reportId}`,
        {
          status_id: selectedStatus,
        }
      );
      const updatedReports = employeeReports.map((report) =>
        report.id === reportId
          ? { ...report, status_id: selectedStatus }
          : report
      );
      setEmployeeReports(updatedReports);

      const updatedAllReports = reports.map((report) =>
        report.id === reportId
          ? { ...report, status_id: selectedStatus }
          : report
      );
      setReports(updatedAllReports);
      Swal.fire({
        text: "You've successfully changed the status of the report!",
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error updating report status:', error);
    } finally {
      setEditingReportId(null);
      setSelectedStatus(null);
    }
  };

  return (
    <div className='main-container'>
      <ul className='events'>
        {employeeReports.map((report) => (
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
              <strong>User description: </strong>
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
              <strong>Manager note: </strong> {report.note || 'No note'}
            </p>

            {editingReportId === report.id ? (
              <>
                <p className='custom-select'>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(parseInt(e.target.value))
                    }
                  >
                    {statuses
                      .filter((status) => status.name !== 'Pending')
                      .map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                  </select>
                </p>
                <div className='container'>
                  <button
                    className='event-button'
                    onClick={() => handleApplyClick(report.id)}
                  >
                    Apply
                  </button>
                  <button className='event-button' onClick={handleCancelClick}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {statuses.find((status) => status.id === report.status_id)
                  ?.name || 'Unknown'}
                <img
                  src={getIconByStatus(report.status_id).options.iconUrl}
                  alt='status-icon'
                  style={{
                    width: '20px',
                    verticalAlign: 'middle',
                    marginRight: '8px',
                  }}
                />

                <button
                  className='event-button'
                  onClick={() => handleEditClick(report.id, report.status_id)}
                >
                  Change status
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsEmployee;
