import { createContext, useContext, useEffect, useReducer, useCallback } from "react";

const CitiesContext = createContext();

function reducer(state, action){
  switch(action.type){
    case "loading":
      return {...state, isLoading:true}
    case "city/loaded":
      return {...state, isLoading:false, currentCity:action.payload}
    case "cities/loaded":
      return {...state, isLoading:false, cities:action.payload}
    case "city/posted":
      return {...state, isLoading: false, cities:[...state.cities, action.payload], currentCity:action.payload}
    case "cities/deleted":
      return {...state, isLoading:false,cities: state.cities.filter(city=> city.id !== action.payload), currentCity:{}}
    case "rejected":
      return {...state, isLoading:false, error: action.payload}
    default: throw new Error("Unknown action.")
  }
}

const initaiLSate = {
  cities:[],
  isLoading:false,
  currentCity:{},
  error:"",
}

function CitiesProvider({ children }){

    const [{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initaiLSate);


     useEffect(function(){
        (async function (){
          try{
            dispatch({type:"loading"});
            const res = await fetch(`http://localhost:9000/cities`);
            const data = await res.json();
            
            if(!res.ok)
                 throw new Error('Data was not fetched...');
  
            dispatch({type:"cities/loaded", payload:data})
          } catch(err){
            dispatch({type:"rejected", payload: err.message})
          } 
        })()
     }, []);

  const getCity = useCallback(async function getCity(id){
        try{
          if(currentCity.id === +id)return;

          dispatch({type:"loading"});
          const response = await fetch(`http://localhost:9000/cities/${id}`);
          const data = await response.json();
          
          if(!response.ok)
               throw new Error('Data was not fetched...');

          dispatch({type:"city/loaded", payload: data})
        } catch(err){
          dispatch({type:"rejected", payload: err.message})
        } 
    }, [currentCity.id])


      async function postNewCity(newCity){
        try{
          dispatch({type:"loading"});
          const response = await fetch(`http://localhost:9000/cities`, {
              method :"POST",
              headers:{
                "Content-Type":"application/json",
              },
              body:JSON.stringify(newCity)
          });

          const data = await response.json();
          dispatch({type:"city/posted", payload:data});
        } catch(err){
          dispatch({type:"rejected", payload: "There was an error posting a new city."})
        } 
    }

    async function deleteCity(id){
      try{
        dispatch({type:"loading"});
        await fetch(`http://localhost:9000/cities/${id}`, {method:"DELETE"});
        
        dispatch({type:"cities/deleted", payload: id});
      } catch(err){
        dispatch({type:"rejected",payload: "There was an error deliting city."});
      } 
  }

     return (
        <CitiesContext.Provider value={{
            cities, 
            isLoading,
            currentCity,
            getCity,
            postNewCity,
            deleteCity,
        }}>
            {children}
        </CitiesContext.Provider>
     )
}

function useCities(){
    const context = useContext(CitiesContext);
    if(context === undefined) 
        throw new Error("Context must be accesed inside of the provider!!!");

    return context;
}

export { CitiesProvider, useCities };