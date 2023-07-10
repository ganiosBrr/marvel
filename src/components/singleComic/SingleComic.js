import './singleComic.scss';
import xMen from '../../resources/img/x-men.png';
import { useEffect, useState } from 'react';
import useMarvelservice from '../../services/MarvelService';
import ErrorMessage from '../../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';

const SingleComic = ({selectedChar}) => {

    const [comic, setComic] = useState(null);
    const {loading, error, getSingleComic, clearError} = useMarvelservice();

    useEffect(() => {
        updateComic();
    }, []);

    const updateComic = () => {
        clearError();

        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getSingleComic(100)
            .then(onComicLoaded);
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;

    const content = !(loading || spinner || !comic) ? <View comic={comic}/> : null;

    return (
        <div className="single-comic">
            {spinner}
            {errorMessage}
            {content}
            <a href="#" className="single-comic__back">Back to all</a>
        </div>
    )
}

const View = ({comic}) => {
    const {title, description, thumbnail, pageCount, language, price} = comic;
    const imageNotFound = 'image_not_available';

    return(
        <>
            <img 
                src={thumbnail} 
                alt="x-men" 
                className={thumbnail.indexOf(imageNotFound) !== -1 
                    ? "single-comic__img not-found" 
                    : "single-comic__img"}
                />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language:{language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
        </>
    );
}

export default SingleComic;