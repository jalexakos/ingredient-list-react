import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  
  // useEffect - used for managing side effects; gets rendered after every render cycle. You can have multiple useEffect calls. Declare dependencies in array as second value in call
  useEffect(() => {
    console.log(`RENDERING INGREDIENTS ${userIngredients}`)
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
    }, []);

  const addIngredientHandler = ingredient => {
    fetch(process.env.REACT_APP_INGREDIENTS_URL, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ]);
    })
    .catch(error => {
      console.log(error)
    })
  }

  const removeIngredientHandler = id => {
    fetch(process.env.REACT_APP_BASE_URL + `/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id))
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
