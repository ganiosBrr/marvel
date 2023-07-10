import './comicsList.scss';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../../errorMessage/errorMessage';
import { useEffect, useState } from 'react';
import useMarvelservice from '../../services/MarvelService';

const ComicsList = ({onCharSelected, selectedChar}) => {
    const [comics, setComics] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelservice();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true); 
        getAllComics(offset)
            .then(onComicsLoaded);
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;

        if(newComics.length < 8) {
            ended = true;
        }

        setComics([...comics, ...newComics]);
        setNewComicsLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderComics(arr) {
        const items = arr.map((item, i) => {
            const {thumbnail, title, price} = item;

            return (
                <li 
                    className="comics__item"
                    key={i}
                >
                    <a href="#">
                        <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>  
            );
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }

    const items = renderComics(comics);

    const spinner = loading && !newComicsLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return(
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}  
            <button 
                disabled={newComicsLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
           
    );
}



export default ComicsList;