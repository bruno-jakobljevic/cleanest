import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
});
const yellowIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
});
const greenIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
});

const getIconByStatus = (statusId) => {
  switch (statusId) {
    case 1:
      return redIcon;
    case 2:
      return yellowIcon;
    case 3:
      return greenIcon;
    default:
      return greenIcon;
  }
};

const Reports = ({ reports, status, setStatus }) => {
  const solinCoordinates = [43.54431, 16.48533];

  return (
    <>
      <div>
        <label>
          <input
            type='radio'
            name='status'
            value={1}
            checked={status === 1}
            onChange={() => setStatus(1)}
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
          />
          All
        </label>
      </div>
      <MapContainer
        center={solinCoordinates}
        zoom={15}
        style={{ height: '100vh', width: '100%' }}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[Number(report.lattitude), Number(report.longitude)]}
            icon={getIconByStatus(report.status_id)}
          >
            <Popup>
              {report.description ? report.description : 'No description'}
              <br />
              Latitude: {report.lattitude}, Longitude: {report.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Reports;
