import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getIconByStatus } from '../utils/icons';

const Reports = ({ reports, status, setStatus, statuses }) => {
  const statusLookup = statuses.reduce((acc, statusObj) => {
    acc[statusObj.id] = statusObj.name;
    return acc;
  }, {});

  const solinCoordinates = [43.54431, 16.48533];

  const filteredReports = reports.filter(
    (report) => status === 4 || report.status_id === status
  );
  return (
    <div className='reports-content'>
      <div className='map-container'>
        <MapContainer
          center={solinCoordinates}
          zoom={15}
          reports-content
          className='reports-map'
          scrollWheelZoom={false}
          doubleClickZoom={false}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[Number(report.latitude), Number(report.longitude)]}
              icon={getIconByStatus(report.status_id)}
            >
              <Popup>
                <strong>Description: </strong>
                {report.description ? report.description : 'No description'}
                <br />
                <strong>Status:</strong> {statusLookup[report.status_id]}
                <br />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className='filter'>
        <h2>Status:</h2>
        <div className='card-container'>
          <label>
            <input
              type='radio'
              name='status'
              value={1}
              checked={status === 1}
              onChange={() => setStatus(1)}
              className='custom-radio'
              id='outline'
            />
            Pending
          </label>
          <label>
            <input
              type='radio'
              name='status'
              value={2}
              checked={status === 2}
              onChange={() => setStatus(2)}
              className='custom-radio'
              id='outline'
            />
            In Progress
          </label>
          <label>
            <input
              type='radio'
              name='status'
              value={3}
              checked={status === 3}
              onChange={() => setStatus(3)}
              className='custom-radio'
              id='outline'
            />
            Resolved
          </label>
          <label>
            <input
              type='radio'
              name='status'
              value={4}
              checked={status === 4}
              onChange={() => setStatus(4)}
              className='custom-radio'
              id='outline'
            />
            All Reports
          </label>
        </div>
      </div>
    </div>
  );
};

export default Reports;
