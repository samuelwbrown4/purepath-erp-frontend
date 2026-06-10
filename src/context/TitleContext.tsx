import {createContext , useContext , useState, type ReactNode} from 'react';

interface TitleContextType{
    title: string,
    setTitle: (title: string) => void
}

interface TitleProviderProps{
    children: ReactNode
}

const TitleContext = createContext<TitleContextType | null>(null);

function TitleProvider({children}: TitleProviderProps){
    const [title , setTitle] = useState('')
    return(
        <TitleContext.Provider value={{title , setTitle}}>
            {children}
        </TitleContext.Provider>
    )
}

function useTitleContext() {
    const context = useContext(TitleContext)
    if (!context) throw new Error('useTitleContext must be used inside TitleProvider')
    return context
}

export {TitleProvider , useTitleContext};