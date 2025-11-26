import './Map.css';

const Map = () => {
  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/RMDLLGRdn3NhbXEu5', '_blank');
  };

  return (
    <section id="map" className="map-section">
      <div className="container">
        <div className="section-title">
          <h2>Find Us</h2>
          <p>Visit our campus and experience our world-class facilities</p>
        </div>

        <div className="map-container" onClick={handleMapClick} style={{ cursor: 'pointer' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7889654321!2d77.1234567!3d28.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin&markers=color:red%7C28.1234567,77.1234567"
            width="100%"
            height="450"
            style={{ border: 0, pointerEvents: 'none' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location"
          ></iframe>
          <div className="map-click-overlay">
            <span className="map-click-text">📍 Click to open in Google Maps</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
