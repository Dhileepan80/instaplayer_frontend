import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import Header from '../../globals/components/Header';
import bannerImg from '../../assets/images/home_banner.png';
import { resturls } from '../../globals/utils/apiurls';
import GlobalService from '../../globals/services/GlobalService';
import styles from './scss/HomePanel.module.scss';
import MovieCard from './MovieCard';
import DefaultLoader from '../../globals/components/DefaultLoader';

export default function HomePanel() {
  const [state, setState] = useState({
    loading: true,
    searchQuery: window.localStorage.getItem('searchQuery') || '',
    trendingList: [],
    activePageNo: 1,
    totalPages: 1,
  });

  const timeOutFn = useRef(() => {});

  const {
    searchQuery, trendingList, activePageNo, loading, totalPages,
  } = state;

  const getTrendingMovieList = useCallback((pageNo = 1) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    GlobalService.generalSelect(
      (respData) => {
        if (respData) {
          window.localStorage.setItem('activePage', pageNo);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            activePageNo: pageNo,
            trendingList: respData.results,
            totalPages: respData.total_pages > 500 ? 500 : respData.total_pages,
          }));
        }
      },
      `${resturls.trendingMovies}?page=${pageNo}`, 'GET',
    );
  }, []);

  const filterMovieList = useCallback((queryVal, pageNo = null) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    GlobalService.generalSelect(
      (respData) => {
        if (respData) {
          window.localStorage.setItem('activePage', pageNo || 1);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            activePageNo: pageNo || 1,
            trendingList: respData.results,
            totalPages: respData.total_pages > 500 ? 500 : respData.total_pages,
          }));
        }
      },
      `${resturls.search}?query=${queryVal}${pageNo ? `&page=${pageNo}` : ''}`, 'GET',
    );
  }, []);

  useEffect(() => {
    const searchQueryInLS = window.localStorage.getItem('searchQuery');
    const activePageInLS = Number(window.localStorage.getItem('activePage'));

    if (window.localStorage.getItem('searchQuery')) {
      filterMovieList(searchQueryInLS, activePageInLS || null);
    } else {
      getTrendingMovieList(activePageInLS || 1);
    }

    return () => {
      clearTimeout(timeOutFn.current);
    }
  }, [getTrendingMovieList, filterMovieList]);

  const handleSearchInputOnChange = useCallback(({ target: { value } }) => {
    setState((prevState) => ({
      ...prevState,
      searchQuery: value,
      loading: true,
    }));
    window.localStorage.setItem('searchQuery', value);
    clearTimeout(timeOutFn.current);

    if (value === '') {
      getTrendingMovieList(1);
      return;
    }

    timeOutFn.current = setTimeout(() => {
      filterMovieList(value);
    }, 2000);
  }, [filterMovieList, getTrendingMovieList]);

  const handlePageChange = useCallback((pageno) => {
    if (searchQuery !== '') {
      filterMovieList(searchQuery, pageno);
    } else {
      getTrendingMovieList(pageno);
    }
  }, [searchQuery, filterMovieList, getTrendingMovieList]);

  return (
    <>
      <Header
        showSearch
        searchInputValue={searchQuery}
        handleSearchInputOnChange={handleSearchInputOnChange}
      />

      <div className={styles.homePanelContainer}>
        <img src={bannerImg} alt="home_banner" />

        <div>
          <span>Trending</span>

          <div>
            {loading
              ? (
                <DefaultLoader />
              ) : (
                <>
                  {trendingList.length === 0
                    ? (
                      <span className={styles.noResultsMess}>No results for {searchQuery}</span>
                    ) : (
                      trendingList.map((movieData, idx) => (
                        <MovieCard
                          key={movieData.id}
                          cardNo={idx + 1}
                          movieData={movieData}
                        />
                      ))
                    )}
                </>
              )}
          </div>
          
          {totalPages > 1 && (
            <ResponsivePagination
              extraClassName={`${styles.paginationWrapper} ${loading ? styles.disabledPagination : ''}`}
              current={activePageNo}
              total={totalPages}
              onPageChange={handlePageChange}
              maxWidth={window.innerWidth > 580 ? 400 : 200}
            />
          )}
        </div>
      </div>
    </>
  );
}
