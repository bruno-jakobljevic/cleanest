import React from 'react';

function ReportsManager({
  reports,
  roleId,
  onStatusChange,
  onCheckChange,
  onDelete,
}) {
  return (
    <div>
      <header>
        <h1>Reports</h1>
        {reports.length > 0 ? (
          <ul>
            {reports.map((report) => (
              <li key={report.id}>
                <h2>{report.description}</h2>
                <p>Latitude: {report.lattitude}</p>
                <p>Longitude: {report.longitude}</p>
                <p>Created at: {report.created_at}</p>
                {roleId >= 2 && (
                  <div>
                    <label>Status: </label>
                    <select
                      value={report.status_id}
                      onChange={(e) =>
                        onStatusChange(report.id, parseInt(e.target.value))
                      }
                    >
                      <option value='1'>Pending</option>
                      <option value='2'>In Progress</option>
                      <option value='3'>Resolved</option>
                    </select>
                  </div>
                )}
                {roleId >= 3 && (
                  <div>
                    <label>Checked: </label>
                    <input
                      type='checkbox'
                      checked={report.is_checked === 1}
                      onChange={(e) =>
                        onCheckChange(report.id, e.target.checked ? 1 : 0)
                      }
                    />
                  </div>
                )}
                {roleId >= 3 && (
                  <button onClick={() => onDelete(report.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports available</p>
        )}
      </header>
    </div>
  );
}

export default ReportsManager;
