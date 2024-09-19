import React, { useMemo } from 'react';
import YouTube from 'react-youtube';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useGetMovieDetails from './hooks/useGetMovieDetails';
import useGetVideoKey from './hooks/useGetVideoKey';
import Header from '../../globals/components/Header';
import styles from './scss/MovieDetailsMobilePanel.module.scss';
import desktopStyles from './scss/MovieDetailsPanel.module.scss';
import DefaultLoader from '../../globals/components/DefaultLoader';

export default function MovieDetailsMobilePanel({ match: { params: { movieId } } }) {
  const [loading, movieData] = useGetMovieDetails(movieId);
  const [movieKey] = useGetVideoKey(movieId);

  const history = useHistory();

  const languages = useMemo(() => {
    if (loading) return '';

    return movieData.spoken_languages.map(({ name }) => name).join(', ');
  }, [loading, movieData]);

  return (
    <>
      <Header />

      <div className={styles.movieDetailsMobileWrapper}>
        {loading
          ? (
            <div className={styles.loaderWrapper}>
              <DefaultLoader />
            </div>
          ) : (
            <>
              <i className={desktopStyles.leftArrowIcon} onClickCapture={() => history.push('/home')} />

              <div>
                <YouTube
                  videoId={movieKey}
                  id={movieKey}
                />
              </div>

              <div>
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
            </>
          )}
      </div>
    </>
  );
}
