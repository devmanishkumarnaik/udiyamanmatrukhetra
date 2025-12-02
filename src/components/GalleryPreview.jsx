import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import './GalleryPreview.css';

const GalleryPreview = () => {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get('/gallery');
        const images = response.data.filter(item => item.type === 'image').slice(0, 3);
        setPreviewImages(images);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <section id="gallery-preview" className="gallery-preview">
      <div className="container">
        <div className="section-title">
          <h2>Our Gallery</h2>
          <p>Glimpse into our vibrant school life and activities</p>
        </div>

        <div className="gallery-preview-grid">
          {previewImages.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No images in gallery yet</p>
            </div>
          ) : (
            previewImages.map((image, index) => (
              <div key={image._id} className="gallery-item" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="gallery-image-wrapper">
                  <img src={image.url} alt={image.title} />
                  <div className="gallery-overlay">
                    <span>View More</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="gallery-btn-container">
          <button className="browse-all-btn" onClick={() => navigate('/gallery')}>
            Browse All Gallery
          </button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
