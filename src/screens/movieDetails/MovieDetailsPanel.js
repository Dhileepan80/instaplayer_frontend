import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import defaultPoster from '../../assets/images/default_poster.webp';
import Header from '../../globals/components/Header';
import { mediaBaseUrl } from '../../globals/utils/constants';
import DefaultLoader from '../../globals/components/DefaultLoader';
import styles from './scss/MovieDetailsPanel.module.scss';
import VideoPlayerModal from './VideoPlayerModal';
import useGetMovieDetails from './hooks/useGetMovieDetails';
import useGetVideoKey from './hooks/useGetVideoKey';

export default function MovieDetailsPanel({ match: { params: { movieId } } }) {
  const [state, setState] = useState({
    isVideoPlayerModalOpen: false,
  });

  const movieWrapperRef = useRef(null);

  const history = useHistory();

  const [loading, movieData] = useGetMovieDetails(movieId);
  const [movieKey] = useGetVideoKey(movieId);

  const {
    isVideoPlayerModalOpen,
  } = state;

  const languages = useMemo(() => {
    if (loading) return '';

    return movieData.spoken_languages.map(({ name }) => name).join(', ');
  }, [loading, movieData]);

  useLayoutEffect(() => {
    if (movieWrapperRef.current) {
      movieWrapperRef.current.style.background = `
        linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 17%, rgba(0, 0, 0, 0.8) 100%),
        url(${movieData.backdrop_path ? `${mediaBaseUrl}${movieData.backdrop_path}` : `${defaultPoster}`})
        no-repeat right center / 80% 100%
      `;
    }
  }, [movieData]);

  return (
    <>
      <Header />

      <div className={styles.movieDetailsPanelWrapper}>
        {loading
          ? (
            <div className={styles.loader}>
              <DefaultLoader />
            </div>
          ) : (
            <div
              ref={movieWrapperRef}
              className={styles.movieWrapper}
            >
              <div>
                <i className={styles.leftArrowIcon} onClickCapture={() => history.push('/home')} />
                <div>
                  {movieData.title}
                </div>
                <span>Rating: <span>{(movieData.vote_average / 2).toFixed(2)}/5</span></span>
                <p>{movieData.overview}</p>
                <div>
                  <span>Release Date</span>
                  <span>{moment(new Date(movieData.release_date)).format('DD-MMM-YYYY')}</span>
                </div>
                <div>
                  <span>Orginal Language</span>
                  <span>
                    {languages}
                  </span>
                </div>
              </div>
              <div>
                {movieKey !== 'noVideo' && (
                  <i
                    className={styles.playIcon}
                    onClickCapture={() => {
                      setState((prevState) => ({
                        ...prevState,
                        isVideoPlayerModalOpen: !prevState.isVideoPlayerModalOpen,
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          )}
      </div>

      {isVideoPlayerModalOpen && (
        <VideoPlayerModal
          movieId={movieId}
          movieKey={movieKey}
          onClose={() => {
            setState((prevState) => ({
              ...prevState,
              isVideoPlayerModalOpen: false,
            }))
          }}
        />
      )}
    </>
  );
}
