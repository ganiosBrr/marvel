import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/spinner';
import Marvelservice from '../../services/MarvelService';
import ErrorMessage from '../../errorMessage/errorMessage';

import './charList.scss';

const CharList = ({onCharSelected, selectedChar}) => {

    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newCharLoading, setNewCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new Marvelservice();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onNewCharLoading()
        marvelService
            .getAllCharacters(offset)
            .then(data => onCharsLoaded(data))
            .catch(onError)
    }

    const onNewCharLoading = () => {
        setNewCharLoading(true);
    }

    const onCharsLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setChars((chars) => [...chars, ...newCharList]);
        setLoading(loading => false);
        setNewCharLoading(newCharLoading => false);
        setOffset((offset) => offset + 9);
        setCharEnded((charEnded) => ended);

    }

    const onError = () => {
        setLoading(loading => false);
        setError(true);
    }

    //метод в основном для оптимизации для того
    //чтобы не помещать такое в рендер
    function renderItems(arr) {
        const items =  arr.map((item) => {
            const {thumbnail, name} = item;
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'contain'};
            }
            const isSelected = selectedChar === item.id ? 'selected' : '';
            return (
                <li 
                    className={`char__item ${isSelected}`} 
                    key={item.id}
                    onClick={() => onCharSelected(item.id)}
                >
                    <img src={thumbnail} alt="abyss" style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            );
        });

        //это чтобы отцентрировать спиннеры
        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    } 

    
    //const {chars, loading, newCharLoading, error, offset, charEnded} = this.state;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error) ? renderItems(chars) : null;
    return (
        <div className="char__list">  
            {spinner}
            {errorMessage}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newCharLoading} 
                onClick={() => onRequest(offset)}
                style={{"display": charEnded ? "none" : "block"}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;