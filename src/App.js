import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Main from "./Main";
import Logo from "./Logo";
import Search from "./Search";
import NumResults from "./NumResults";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchedSummary from "./WatchedSummary";
import WatchedList from "./WatchedList";
import MovieDetail from "./MovieDetail";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

// const KEY = "3c17c796";
const KEY = process.env.REACT_APP_KEY;

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const omdbURL = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`;
  const { movies, isLoading, error } = useMovies(query, omdbURL);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue) || [];
  // });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  // useEffect(() => {
  //   const controller = new AbortController();
  //   async function fetchMovies() {
  //     try {
  //       setIsLoading(true);
  //       setError("");
  //       const res = await fetch(omdbURL, { signal: controller.signal });

  //       if (!res.ok)
  //         throw new Error("Something went wrong with fetching movies");
  //       const data = await res.json();
  //       if (data.Response === "False") throw new Error("Movie not found");

  //       setMovies(data.Search);
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.log(err.message);
  //         setError(err.message);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   if (query.length < 3) {
  //     setMovies([]);
  //     setError("");
  //     return;
  //   }
  //   handleCloseMovie();
  //   fetchMovies();
  //   return function () {
  //     controller.abort();
  //   };
  // }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              apiKey={KEY}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
