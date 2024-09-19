import { useEffect, useState } from "react";
import GlobalService from "../../../globals/services/GlobalService";
import { resturls } from "../../../globals/utils/apiurls";

export default function useGetMovieDetails(movieId) {
  const [state, setState] = useState({
    loading: true,
    movieData: {},
  });

  const {
    loading, movieData,
  } = state;

  useEffect(() => {
    GlobalService.generalSelect(
      (respData) => {
        if (respData) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            movieData: respData,
          }));
        }
      },
      `${resturls.getMovieDetails}/${movieId}`, 'GET',
    );
  }, [movieId]);

  return [loading, movieData];
}