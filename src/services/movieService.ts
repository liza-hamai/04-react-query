import axios from "axios";
import type { Movie } from "../types/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieHttpResponse {
    results: Movie[];
    total_pages: number;
}

export default async function fetchMovies (query: string, page: number): Promise<MovieHttpResponse> {
    const response = await axios.get<MovieHttpResponse>(
        `https://api.themoviedb.org/3/search/movie`,
        {
            params: {
                query: query,
                include_adult: false,
                language: "en-US",
                page: page
            },
            headers: {
                Authorization : `Bearer ${TOKEN}`
            } 
        }
    )

    return response.data;
}