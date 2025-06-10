import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import "./MovieCard.css"; // Assuming you have a CSS file for styling

const MovieCard = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const API_KEY =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWUwMGI2OGQ4NGJlZDYzMjMwMDEyMTBjMmU1NDU5OCIsIm5iZiI6MTY4ODAzNDg0OS4xMDUsInN1YiI6IjY0OWQ1ZTIxMDkxZTYyMDEwYzEwZTM4ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2DwKT3qRLYZKhjYPbYEbann01t32-ZIt-ZQKpdPkhqc";
  const BASE_URL = "https://api.themoviedb.org/3";

  const fetchMovies = async (type) => {
    setIsLoading(true);
    try {
      let url;

      switch (type) {
        case "trending":
          url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
          break;
        case "now_playing":
          url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
          break;
        case "top_rated":
          url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
          break;
        case "upcoming":
          url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`;
          break;
        default: // popular
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: API_KEY },
      });

      setMovies(response.data.results);
      console.log("Fetched movies:", response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrailer = async (movieId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`,
        { headers: { Authorization: API_KEY } }
      );

      const trailers = response.data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers[0].key}`);
        setShowTrailer(true);
      } else {
        alert("No trailer available for this movie");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("Error loading trailer");
    }
  };

  useEffect(() => {
    fetchMovies(activeTab);
  }, [activeTab]);

  return (
    <div className="netflix-container">
      <h1 className="netflix-title">MovieFlix</h1>

      {/* Navigation Tabs */}
      <div className="netflix-tabs">
        <button
          className={`netflix-tab ${activeTab === "popular" ? "active" : ""}`}
          onClick={() => setActiveTab("popular")}
        >
          Popular
        </button>
        <button
          className={`netflix-tab ${activeTab === "trending" ? "active" : ""}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`netflix-tab ${
            activeTab === "now_playing" ? "active" : ""
          }`}
          onClick={() => setActiveTab("now_playing")}
        >
          Now Playing
        </button>
        <button
          className={`netflix-tab ${activeTab === "top_rated" ? "active" : ""}`}
          onClick={() => setActiveTab("top_rated")}
        >
          Top Rated
        </button>
        <button
          className={`netflix-tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
      </div>

      {isLoading ? (
        <div className="netflix-loading">Loading...</div>
      ) : (
        <div className="netflix-row">
          {movies.map((movie) => (
            <div key={movie.id} className="netflix-card">
              <div className="netflix-card-inner">
                <div className="netflix-card-front">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="netflix-card-img"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/500x750?text=No+Poster";
                      featured;
                    }}
                  />
                  <div className="netflix-card-overlay flex justify-center items-center">
                    <div className="netflix-card-rating">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div className="netflix-card-back">
                  <h3 className="netflix-card-title">{movie.title}</h3>
                  <p className="netflix-card-description">
                    {movie.overview
                      ? movie.overview.substring(0, 150) + "..."
                      : "No description available"}
                  </p>
                  <div className="netflix-card-meta">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                  <button
                    className="netflix-card-button"
                    onClick={() => fetchTrailer(movie.id)}
                  >
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="netflix-trailer-modal">
          <div className="netflix-trailer-content">
            <button
              className="netflix-trailer-close"
              onClick={() => {
                setShowTrailer(false);
                setTrailerUrl("");
              }}
            >
              ×
            </button>
            <div className="netflix-trailer-player">
              <ReactPlayer
                url={trailerUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
