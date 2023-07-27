import "./singleComicPage.scss";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import useMarvelservice from "../../services/MarvelService";
import ErrorMessage from "../../errorMessage/errorMessage";
import Spinner from "../spinner/spinner";

const SingleComicPage = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const { loading, error, getSingleComic, clearError } = useMarvelservice();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    clearError();
    getSingleComic(comicId)
        .then(onComicLoaded);
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  const content = !(loading || spinner || !comic) ? (
    <View comic={comic} />
  ) : null;

  return (
    <div className="single-comic">
      {spinner}
      {errorMessage}
      {content}
      <Link to={"/comics"} className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};

const View = ({ comic }) => {
  const { title, description, thumbnail, pageCount, language, price } = comic;
  const imageNotFound = "image_not_available";

  return (
    <>
    <Helmet>
        <meta
          name="description"
          content={`${title} comic book`}
        />
        <title>{title}</title>
    </Helmet>
      <img
        src={thumbnail}
        alt="x-men"
        className={
          thumbnail.indexOf(imageNotFound) !== -1
            ? "single-comic__img not-found"
            : "single-comic__img"
        }
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
};

export default SingleComicPage;
