import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { useState, useEffect } from 'react';
import Marvelservice from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../../errorMessage/errorMessage';

const RandomChar = () => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    const marvelService = new Marvelservice();

    useEffect(() => {
        updateChar();
    },[]);

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
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        onCharLoading();
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }


        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !( loading || errorMessage || !char) ? <View char={char}/> : null; 

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
}

//разделили компонент на логический (Spinner) и компонент для рендера (View)
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    const imageNotFound = 'image_not_available';

    return(
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" 
            className={
                thumbnail.indexOf(imageNotFound) !== -1 
                ? "randomchar__img not-found" 
                : "randomchar__img"}
            />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RandomChar;