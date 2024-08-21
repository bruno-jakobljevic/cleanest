import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const center = [43.54431, 16.48533];

function ImageAndMapUpload({
  file,
  position,
  report,
  onFileChange,
  onReportChange,
  onAddReport,
  eventHandlers,
  markerRef,
}) {
  return (
    <form onSubmit={onAddReport}>
      <input type='file' onChange={onFileChange} accept='image/*' />
      <div>
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '400px', width: '400px' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          />
        </MapContainer>
        <label>Description:</label>
        <textarea
          name='description'
          value={report.description}
          onChange={onReportChange}
        ></textarea>
      </div>

      <button type='submit'>Submit Report</button>
    </form>
  );
}

export default ImageAndMapUpload;
