import React from 'react';
import MovieDetailsMobilePanel from './MovieDetailsMobilePanel';
import MovieDetailsPanel from './MovieDetailsPanel';
import useResizer from './hooks/useResizer';

export default function MovieDetails(props) {
  const [isMobileView] = useResizer();
  
  return (
    <>
      {isMobileView
        ? <MovieDetailsMobilePanel {...props} />
        : <MovieDetailsPanel {...props} />}
    </>
  );
}
