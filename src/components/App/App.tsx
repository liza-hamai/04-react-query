import toast, { Toaster } from 'react-hot-toast'
import SearchBar from '../SearchBar/SearchBar'
import fetchMovies from '../../services/movieService';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery } from '@tanstack/react-query';
import css from "./App.module.css"
import ReactPaginateModule from "react-paginate";
import { type ReactPaginateProps } from "react-paginate";
import { type ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieId, setMovieId] = useState('');
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useQuery({
    queryKey: ['movie', movieId, page],
    queryFn: () => fetchMovies(movieId, page),
    enabled: movieId !=="",
  });

  const handleSearch = (query: string) => {
    setMovieId(query);
    setPage(1);
  };

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.")
    }
  }, [data])

  return (
    <>
      <Toaster/>
      <SearchBar onSubmit={handleSearch} />
      {(data?.total_pages ?? 0) > 1 && <ReactPaginate
        pageCount={data?.total_pages ?? 0}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />}
      {isLoading && <Loader />}
      {!isLoading && error && <ErrorMessage />}
      <MovieGrid onSelect={setSelectedMovie} movies={data?.results ?? []} />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  )
}

export default App
