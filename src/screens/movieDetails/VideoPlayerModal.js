import React from 'react';
import YouTube from 'react-youtube';
import styles from './scss/VideoPlayerModal.module.scss';
import DefaultLoader from '../../globals/components/DefaultLoader';

export default function VideoPlayerModal({ onClose, movieId, movieKey }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {!movieKey
          ? (
            <div className={styles.loaderWrapper}>
              <DefaultLoader />
            </div>
          ) : (
            <div className={styles.playerWrapper}>
              <button className={styles.modalClose} onClick={onClose}>&times;</button>
              <YouTube
                videoId={movieKey}
                id={movieKey}
              />
            </div>
          )}
      </div>
    </div>
  );
}
