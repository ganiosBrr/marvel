import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Transition, TransitionGroup } from "react-transition-group";

import Spinner from "../spinner/spinner";
import useMarvelservice from "../../services/MarvelService";
import ErrorMessage from "../../errorMessage/errorMessage";

import "./charList.scss";

const CharList = ({ onCharSelected, selectedChar }) => {
  const [chars, setChars] = useState([]);
  const [newCharLoading, setNewCharLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const duration = 500;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 1
  }

  const transitionStyles = {
    entering: { opacity: 0,},
    entered:  { opacity: 1,},
    exiting:  { opacity: 1,},
    exited:  { opacity: 1,},
  };

  const { loading, error, getAllCharacters } = useMarvelservice();
  //используем кастомный хук для оптимизации и избавления повторящегося и не нужного кода
  //таких как loading и error и ненужных методов которые меняют их состояние
  //так как их состояние меняется хуком

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewCharLoading(false) : setNewCharLoading(true);
    getAllCharacters(offset).then((data) => onCharsLoaded(data));
  };

  const onCharsLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setChars((chars) => [...chars, ...newCharList]);
    setNewCharLoading((newCharLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  //метод в основном для оптимизации для того
  //чтобы не помещать такое в рендер
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      const { thumbnail, name } = item;
      let imgStyle = { objectFit: "cover" };
      if (
        thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "contain" };
      }
      const isSelected = selectedChar === item.id ? "selected" : "";
      return (
        <Transition in={true} timeout={duration}>
          { state => (
            <li
              className={`char__item ${isSelected}`}
              key={i}
              onClick={() => onCharSelected(item.id)}
              style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }}
            >
              <img src={thumbnail} alt="abyss" style={imgStyle} />
              <div className="char__name">{name}</div>
            </li>)
          }
        </Transition>
      );
    });

    //это чтобы отцентрировать спиннеры
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(chars);

  const spinner = loading && !newCharLoading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      {items}
      <button
        className="button button__main button__long"
        disabled={newCharLoading}
        onClick={() => onRequest(offset)}
        style={{ display: charEnded ? "none" : "block" }}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
