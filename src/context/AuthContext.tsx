import { createContext, ReactNode, useEffect, useState } from "react"
import {firebase ,auth} from "../services/firebase"

type User = {
    id:string;
    name:string;
    avatar:string;
  }
  
  type AuthContextProps = {
    user?:User;
    signInWithgoogle:()=>Promise<void>;
  }
  
  
  
export const AuthContext = createContext({} as AuthContextProps )
  
type AuthContextProviderProps = {
    children:ReactNode
}

export function AuthContextProvider(props:AuthContextProviderProps){
    const [ user, setUser ] = useState<User>()

    useEffect(()=>{
      const unSubscribe =  auth.onAuthStateChanged((user) => {
        if(user){
          const { displayName, photoURL, uid } = user;
  
          if(!displayName || !photoURL){
            throw new Error("Missing information from Google account!")
          }
  
          setUser({
            id: uid,
            name:displayName,
            avatar:photoURL
          })
        }
      })

      return ()=> { 
          unSubscribe()
        }
    },[])
  
    async function signInWithgoogle(){
      const provider = new firebase.auth.GoogleAuthProvider()
      const result = await auth.signInWithPopup(provider)
        if(result.user){
          const { displayName, photoURL, uid } = result.user;
  
          if(!displayName || !photoURL){
            throw new Error("Missing information from Google account!")
          }
  
          setUser({
            id: uid,
            name:displayName,
            avatar:photoURL
          })
        }
      
    }
    
    return(
        <AuthContext.Provider value={{user, signInWithgoogle }}>
            {props.children}
        </AuthContext.Provider>
    )

}