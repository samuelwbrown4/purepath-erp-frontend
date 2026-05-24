import {createContext , useContext , useState} from 'react';

const TitleContext = createContext();

function TitleProvider({children}){
    const [title , setTitle] = useState('')
    return(
        <TitleContext.Provider value={{title , setTitle}}>
            {children}
        </TitleContext.Provider>
    )
}

export {TitleProvider , TitleContext};