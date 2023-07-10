import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ComicsList from "../comicsList/ComicsList";
import { useState } from "react";

import decoration from '../../resources/img/vision.png';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import SingleComic from "../singleComic/SingleComic";

const App = () => {

    const [selectedChar, setSelectedChar] = useState(null);


    const onCharSelected = (id) => {
        setSelectedChar(id);
    }

    return (
        <div className="app">
            <AppHeader/>
            <main>
                {/* <RandomChar/>
                <div className="char__content">
                    <ErrorBoundary>
                        <CharList onCharSelected={onCharSelected} selectedChar={selectedChar}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharInfo selectedChar={selectedChar}/>
                    </ErrorBoundary>
                </div> */}
                {/* <ComicsList selectedChar={selectedChar}/> */}
                <SingleComic/>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
}

export default App;