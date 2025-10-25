import React from 'react';

// Embedded PNG as base64 data URI (placeholder). Replace `base64Data` with your actual PNG base64
// if you want the exact exported image from Procreate.
const base64Data =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKklEQVQ4T6WTsUoDQRBFz3YgR2gQGxkY2CgqGoqKq6CkY2BhY2tghY2CkR2dkbGxkZ2cRkYt3e5mZ2d2c2f/Zu3c2Z3s3eYyQyQx3M8wz0k2m3Z3hXQ9wF8oA3UC0gV0Qv0J1gG852m/sA9y8g4vN6gK0gF0Qn0H3gD6bqgF0Qv0J1gG8x3hgQ3u+6Q2Zk2m3Z3hXQ9wF8oA3UC0gV0Qv0J1gG8x3hgQ3u+6Q2Zk2m3Z3hXQ9wF8oA3UO0gJ3Qv0J1gG8x3hgQ3u+6Q2Zk2m3Z3hXQ9wF8oA3UC0gV0Qv0J1gG8x3hgQ3u+6Q2Zk2m3Z3hXQ9wF8oA3UC0gV0Qv0J1gG8x3n8Bv3sU6l6rj4wAAAABJRU5ErkJggg==';

const PlusEmbedded = ({ className = '', alt = 'Create', width = 24, height = 24 }) => (
  <svg
    className={className}
    viewBox={`0 0 ${width} ${height}`}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <image href={`data:image/png;base64,${base64Data}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" alt={alt} />
  </svg>
);

export default PlusEmbedded;
