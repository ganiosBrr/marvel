import useHttp from "../components/hooks/http.hook";

const useMarvelservice = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=12b83768fc18996bf457114cfaf43a65";
    const _baseOffset = 210;

    // const getAllCharacters = async (offset = _baseOffset) => {
    //     const res = await request(
    //         `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    //     );
    //     return res.data.results.map(_transformCharacter);
    // };

    const getAllCharacters = async (offset = _baseOffset, name = '') => {
	    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}${name ? `&name=${name}` : '' }&${_apiKey}`);
	    return res.data.results.map(_transformCharacter);
	}

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?/&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const getAllComics = async (offset) => {
        const res = await request(
            `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };

    const getSingleComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformSingleComic(res.data.results[0]);
    };

    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description
                ? `${character.description}`
                : "There is no information about this character.",
            thumbnail:
                character.thumbnail.path + "." + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items,
        };
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            // optional chaining operator
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    };

    const _transformSingleComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || "There is no description",
            pageCount: comic.pageCount
                ? `${comic.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension,
            language: comic.textObjects[0]?.language || "en-us",
            // optional chaining operator
            price: comic.prices[0].price
                ? `${comic.prices[0].price}$`
                : "not available",
        };
    };

    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        getAllComics,
        getSingleComic,
        clearError,
    };
};

export default useMarvelservice;
