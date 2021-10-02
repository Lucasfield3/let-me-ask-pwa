import { createContext, ReactNode, useEffect, useState } from "react"
import { useHistory } from "react-router"

export interface DisplaySpanContextProps {
    itContainsAdmin:boolean;
}

export const DisplaySpanContext = createContext({} as DisplaySpanContextProps)

type DisplaySpanProviderProps = {
    children:ReactNode;
}

export function DisplaySpanProvider({children}:DisplaySpanProviderProps){

    const [ itContainsAdmin, setItContainsAdmin ] = useState<boolean>(false)
    const history = useHistory()

   useEffect(()=> {
       (async ()=> {
           const urlAdmin = await history.location.pathname.includes('admin')
           if(urlAdmin){
                setItContainsAdmin(true)
           }else{
               setItContainsAdmin(false) 
           }
       })()
   }, [history])


    return (
        <DisplaySpanContext.Provider value={{itContainsAdmin}}>
            {children}
        </DisplaySpanContext.Provider>
    )

}