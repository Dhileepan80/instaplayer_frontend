import { useEffect, useState } from "react";
import GlobalService from "../../../globals/services/GlobalService";
import { resturls } from "../../../globals/utils/apiurls";

export default function useGetVideoKey(movieId) {
  const [movieKey, setMovieKey] = useState('');

  useEffect(() => {
    GlobalService.generalSelect(
      (respData) => {
        if (respData.results.length > 0) {
          setMovieKey(respData.results[0].key);
        } else {
          setMovieKey('noVideo');
        }
      },
      `${resturls.getMovieDetails}/${movieId}/videos`, 'GET',
    );
  }, [movieId]);

  return [movieKey];
}