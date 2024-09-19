import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { mediaBaseUrl } from '../../globals/utils/constants';
import defaultPoster from '../../assets/images/default_poster.webp';
import styles from './scss/HomePanel.module.scss';

export default function MovieCard({ movieData, cardNo }) {
  const history = useHistory();

  return (
    <div className={styles.movieCardWrapper} onClickCapture={() => history.push(`/movie/${movieData.id}`)}>
      <div>
        <img
          src={movieData.backdrop_path ? `${mediaBaseUrl}${movieData.backdrop_path}` : defaultPoster}
          alt="poster_path"
        />
      </div>
      <div>
        <div>
          <span>{movieData.title}</span>
          <div>
            {new Array(5).fill('').map((e, idx) => (
              <svg key={`${idx + 1}_svg`} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill={(idx + 1) <= Math.floor(movieData.vote_average / 2) ? '#FFE234' : 'white'} />
              </svg>
            ))}
            <span>
              {(movieData.vote_average / 2).toFixed(2)} / 5
            </span>
          </div>
        </div>
        <div>
          <i className={styles.playIcon} />
        </div>
      </div>
    </div>
  );
}
