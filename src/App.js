import React, { useEffect, useState } from "react";
import "./App.css";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";
import MovieRow from "./components/MovieRow";
import Tmdb from "./Tmdb";

// userState: armazenar um objeto para que possa ser manipulado em outro momento

export default () => {
    const [movieList, setMovieList] = useState([]); // Carregar todos os titulos da netflix usando tmdb
    const [featuredData, setFeaturedData] = useState(null); // Carregar o titulo em destaque
    const [blackHeader, setBlackHeader] = useState(false); // Define se o cabeçalho preto irá aparecer ou não.

    useEffect(() => {
        // É executado quando este componente está sendo carregado
        const loadAll = async () => {
            let list = await Tmdb.getHomeList(); // Requisição a api do tmdb
            setMovieList(list); // Seta a lista de titulos que foram obtidos a partir da requisição

            let originals = list.filter((item) => item.slug === "originals"); // Filtrando os titulos originais da netflix
            let randomChose = Math.floor(
                Math.random() * (originals[0].items.results.length - 1)
            ); // Gerando um número aleatório que será usado para escolher o titulo a ser exibido como "destaque"
            let movieChose = originals[0].items.results[randomChose]; // Obtendo o titulo
            let movieInfo = await Tmdb.getMovieInfo(movieChose.id, "tv"); // Obtendo mais informações sobre o titulo escolhido, requisição a api do tmdb
            setFeaturedData(movieInfo); // Seta o filme em destaque
        };
        loadAll(); // Carrega os titulos da netflix
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };
        window.addEventListener("scroll", scrollListener);
        return () => {
            window.removeEventListener("scroll", scrollListener);
        };
    }, []);

    return (
        <div className="page">
            <Header black={blackHeader}></Header>
            {featuredData && (
                <FeaturedMovie item={featuredData}></FeaturedMovie>
            )}
            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow
                        key={key}
                        title={item.title}
                        items={item.items}
                    ></MovieRow>
                ))}
            </section>
            <footer>
                <div class="div--footer">
                    <div class="footer-content">
                        Feito com
                        <span role="img" aria-label="coracao">
                            ❤️
                        </span>
                        por José Pedro Barreto Santos
                        <br />
                        Direitos de imagem para Netflix
                        <br />
                        Dados obtidos do site Themoviedb.org
                    </div>
                </div>
            </footer>
            {movieList.length <= 0 && (
                <div className="loading">
                    <img
                        src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif"
                        alt="Carregando"
                    ></img>
                </div>
            )}
        </div>
    );
};
