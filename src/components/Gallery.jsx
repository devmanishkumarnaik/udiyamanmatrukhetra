import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaVideo, FaMusic } from 'react-icons/fa';
import axios from '../utils/axiosConfig';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchGalleryMedia = async () => {
      try {
        const response = await axios.get('/gallery');
        setGalleryItems(response.data);
      } catch (error) {
        console.error('Error fetching gallery media:', error);
      }
    };

    fetchGalleryMedia();
  }, []);

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === activeFilter);

  // Search filter
  const searchedItems = searchQuery.trim() === ''
    ? filteredItems
    : filteredItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Limit visible items
  const displayedItems = searchedItems.slice(0, visibleCount);

  // Function to convert video URL to embeddable format
  const getEmbedUrl = (url) => {
    // YouTube URLs
    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${url.split('/').pop()}`;
    }
    if (url.includes('youtube.com/embed')) {
      return url;
    }
    
    // Google Drive URLs
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    
    return url; // Return original if no conversion needed
  };

  // Function to convert audio URL to embeddable format
  const getAudioEmbedUrl = (url) => {
    // Google Drive URLs for audio
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return url; // Return original for direct audio URLs
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
        <h1>Our Gallery</h1>
        <p>Explore our memories through images, videos, and audio</p>
      </div>

      <div className="gallery-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'image' ? 'active' : ''}`}
          onClick={() => setActiveFilter('image')}
        >
          <FaImage /> Images
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'video' ? 'active' : ''}`}
          onClick={() => setActiveFilter('video')}
        >
          <FaVideo /> Videos
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveFilter('audio')}
        >
          <FaMusic /> Audio
        </button>
      </div>

      <div className="gallery-search-container">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(10); // Reset to 10 when searching
          }}
          className="gallery-search-input"
        />
      </div>

      <div className="gallery-container">
        <div className="gallery-grid">
          {displayedItems.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p style={{ fontSize: '1.2rem' }}>
                {searchQuery ? `No results found for "${searchQuery}"` : `No ${activeFilter === 'all' ? 'media' : activeFilter + 's'} available yet`}
              </p>
            </div>
          ) : (
            displayedItems.map((item, index) => (
              <div key={item._id} className="gallery-card" style={{ animationDelay: `${index * 0.1}s` }}>
                {item.type === 'image' && (
                  <div className="gallery-card-content image-content">
                    <img src={item.url} alt={item.title} />
                    <div className="gallery-card-overlay">
                      <h3>{item.title}</h3>
                      {item.description && (
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: '0.95' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {item.type === 'video' && (
                  <div className="gallery-card-content video-content">
                    <iframe
                      src={getEmbedUrl(item.url)}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      style={{ width: '100%', height: '100%' }}
                    ></iframe>
                    <div className="gallery-card-title">
                      <h3>{item.title}</h3>
                      {item.description && (
                        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {item.type === 'audio' && (
                  <div className="gallery-card-content audio-content">
                    <div className="audio-icon">
                      <FaMusic />
                    </div>
                    <h3>{item.title}</h3>
                    {item.description && (
                      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        {item.description}
                      </p>
                    )}
                    {item.url.includes('drive.google.com') ? (
                      <iframe
                        src={getAudioEmbedUrl(item.url)}
                        title={item.title}
                        frameBorder="0"
                        allow="autoplay"
                        style={{ width: '100%', height: '150px', border: 'none' }}
                      ></iframe>
                    ) : (
                      <audio controls style={{ width: '100%' }}>
                        <source src={item.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {searchedItems.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="load-more-btn"
            >
              Load More ({searchedItems.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Results Counter */}
        {displayedItems.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6c757d', fontSize: '0.95rem' }}>
            Showing {displayedItems.length} of {searchedItems.length} {activeFilter === 'all' ? 'items' : activeFilter + 's'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
