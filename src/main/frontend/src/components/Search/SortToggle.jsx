import React from 'react';
import styles from '../../styles/Search/Search.module.css';

const SortToggle = ({ sortType, onChange, isLoggedIn, onCustomClick }) => {
    return (
      <div className={styles.sortToggle}>
        <button
          className={sortType === "popular" ? styles.active : ""}
          onClick={() => onChange("popular")}
        >
          인기순
        </button>
        <span className={styles.separator}>|</span>
        <button
          className={sortType === "latest" ? styles.active : ""}
          onClick={() => onChange("latest")}
        >
          최신순
        </button>
        <span className={styles.separator}>|</span>
  
        {isLoggedIn && (
          <button className={styles.custom} onClick={onCustomClick}>
            맞춤형
          </button>
        )}
      </div>
    );
  };

export default SortToggle;