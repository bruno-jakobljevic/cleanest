import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import axios from 'axios';

import { isNearby } from '../utils/utils';

import Swal from 'sweetalert2';

const center = { lat: 43.54431, lng: 16.48533 };
function ImageAndMapUpload({ decoded, reports, setReports }) {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState({
    latitude: 43.54431,
    longitude: 16.48533,
    description: '',
    image_url: '',
    status_id: 1,
    user_id: decoded.user_id,
  });
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          setPosition(newPosition);
        }
      },
    }),
    [markerRef, setPosition]
  );

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddReport = (e) => {
    if (!file) {
      e.preventDefault();
      Swal.fire({
        text: 'Please select an image to upload.',
        showConfirmButton: false,
        timer: 1500,
        icon: 'error',
      });
      return;
    }
    var updatedReport = {
      ...report,
      image_url: `uploads/${file.name}`,
      latitude: position.lat,
      longitude: position.lng,
    };

    if (isNearby(reports, updatedReport.latitude, updatedReport.longitude)) {
      e.preventDefault();
      Swal.fire({
        text: 'A report has already been submitted at this location.',
        showConfirmButton: false,
        timer: 1500,
        icon: 'error',
      });
      return;
    }
    setReports([...reports, updatedReport]);
    const formData = new FormData();
    formData.append('image', file);
    axios
      .post('http://localhost:3001/multer/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });

    axios
      .post('http://localhost:3001/reports/addReport', updatedReport)
      .catch((error) => console.error(error));
    Swal.fire({
      text: "You've successfully created a report!",
      showConfirmButton: false,
      timer: 1500,
      icon: 'success',
    });
    $(this).unbind('submit').submit()
  };

  return (
    <form onSubmit={handleAddReport}>
      <h1>Add report</h1>
      <input type='file' onChange={handleFileChange} accept='image/*' />
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
        ></Marker>
      </MapContainer>
      <label>Description:</label>
      <textarea
        name='description'
        value={report.description}
        onChange={handleChange}
      ></textarea>
      <button className='event-button' type='submit'>
        Submit Report
      </button>
    </form>
  );
}
export default ImageAndMapUpload;
