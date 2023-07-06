import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import Spinner from '../spinner/spinner';
import Marvelservice from '../../services/MarvelService';
import ErrorMessage from '../../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


const CharInfo = ({selectedChar}) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new Marvelservice();

    useEffect(() => {
        updateChar();
    },[selectedChar]);

    const onCharLoaded = (char) => { 
        setLoading(loading => false);
        setChar(char);
    }

    const onError = () => {
        setLoading(loading => false);
        setError(error => true);
    }

    const onCharLoading = () => {
        setLoading(loading => true);
    }

    const updateChar = () => {
        if (!selectedChar) {
            return;
        }

        onCharLoading();
        marvelService 
            .getCharacter(selectedChar)
            .then(onCharLoaded)
            .catch(onError)
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !( loading || errorMessage || !char) ? <View char={char}/> : null; 

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "Sorry there is no comics..."}  
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line array-callback-return
                        if (i > 10) return;
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        );

                    })
                }
            </ul>
        </>
    );
}

CharInfo.propTypes = {
    selectedChar: PropTypes.number
}

export default CharInfo;