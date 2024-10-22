import React from 'react';
import './Collection.css';

function Collection({ totalCollection }) {
  return (
    <div className="lala">
      <div className="label">Collection</div>
      <div className="collection">{totalCollection.toLocaleString()}</div> {/* Format number with commas */}
    </div>
  );
}

export default Collection;
