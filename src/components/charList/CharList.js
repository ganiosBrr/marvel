import { Component } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/spinner';
import Marvelservice from '../../services/MarvelService';
import ErrorMessage from '../../errorMessage/errorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newCharLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new Marvelservice();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onNewCharLoading()
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharsLoaded)
        .catch(this.onError)
    }

    onNewCharLoading = () => {
        this.setState({
            newCharLoading: true
        })
    }

    onCharsLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }


        this.setState((prevState) => ({
            chars: [...prevState.chars, ...newCharList],
            loading: false,
            newCharLoading: false,
            offset: prevState.offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    //метод в основном для оптимизации для того
    //чтобы не помещать такое в рендер
    renderItems(arr){
        const items =  arr.map((item) => {
            const {thumbnail, name} = item;
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'contain'};
            }
            return (
                <li 
                    className="char__item" 
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}
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

    render() {
        const {chars, loading, newCharLoading, error, offset, charEnded} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? this.renderItems(chars) : null;
        return (
            <div className="char__list">  
                {spinner}
                {errorMessage}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newCharLoading} 
                    onClick={() => this.onRequest(offset)}
                    style={{"display": charEnded ? "none" : "block"}}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;