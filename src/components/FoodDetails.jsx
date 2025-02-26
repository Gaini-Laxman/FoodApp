import { useEffect, useState } from "react";
import styles from "./fooddetails.module.css";

export default function FoodDetails({ foodId }) {
  const [food, setFood] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const URL = `https://api.spoonacular.com/recipes/${foodId}/information`;
  const API_KEY = "819d81a547174bc39a8c913e4b6191e1";

  useEffect(() => {
    if (!foodId) return; // ✅ Prevent unnecessary API calls

    async function fetchFood() {
      try {
        const res = await fetch(`${URL}?apiKey=${API_KEY}`);
        const data = await res.json();
        setFood(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching food details:", error);
        setIsLoading(false);
      }
    }

    fetchFood();
  }, [foodId]);

  if (isLoading) return <p>Loading food details...</p>; // ✅ Prevent crashes
  if (!food) return <p>No food details available.</p>; // ✅ Handle API failure

  return (
    <div className={styles.foodDetailsContainer}>
      <RecipeCard food={food} />
      <RecipeInstructions steps={food.analyzedInstructions?.[0]?.steps} />
    </div>
  );
}

// ✅ Extracted Recipe Card Component
function RecipeCard({ food }) {
  return (
    <div className={styles.recipeCard}>
      <h1 className={styles.recipeName}>{food.title}</h1>
      <img
        className={styles.recipeImage}
        src={food.image}
        alt={food.title || "Food Image"}
      />

      <div className={styles.recipeDetails}>
        <span>
          <strong>⏰ {food.readyInMinutes} Minutes Delivery</strong>
        </span>
        👨‍👩‍👧‍👦<span> Serves {food.servings} People</span>
        <span>{food.vegetarian ? " 🥕 Vegetarian" : " 🍖 Non-vegetarian"}</span>
        <span>{food.vegan ? " 🐮 Vegan" : ""}</span>
      </div>

      <div>
        $ <span>{(food.pricePerServing ?? 0) / 100} Per Serving</span>
      </div>
    </div>
  );
}

// ✅ Extracted Instructions Component
function RecipeInstructions({ steps }) {
  return (
    <div className={styles.recipeInstructions}>
      <h2>Instructions</h2>
      <ol>
        {steps?.length ? (
          steps.map((step, index) => <li key={index}>{step.step}</li>)
        ) : (
          <p>No instructions available.</p>
        )}
      </ol>
    </div>
  );
}
