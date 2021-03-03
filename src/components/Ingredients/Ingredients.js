import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();

  // const [ userIngredients, setUserIngredients ] = useState([]);
  // const [ isLoading, setIsLoading ] = useState(false);
  // const [ error, setError ] = useState();
  
  // useEffect - used for managing side effects; gets rendered after every render cycle. You can have multiple useEffect calls. Declare dependencies in array as second value in call
  useEffect(() => {
    if (!isLoading && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra})
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: {id: data.name, ...reqExtra }})
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients })
    }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      '/ingredients.json', 
      'POST', 
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
      )
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(`/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT')
    // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id))
    // dispatch({ type: 'DELETE', id })
  },[sendRequest]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} />
    )
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm 
      onAddIngredient={addIngredientHandler} 
      loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
