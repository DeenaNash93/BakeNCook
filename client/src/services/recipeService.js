export async function getApprovedRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes", {
    credentials: "include",
  });

  return res.json();
}

export async function getMyRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes/my", {
    credentials: "include",
  });

  return res.json();
}

export async function createRecipe(formData) {
  const res = await fetch("http://localhost:5000/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  return res.json();
}

export async function uploadRecipeImage(recipeId, imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}/image`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return res.json();
}
export async function getPendingRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes/pending", {
    credentials: "include",
  });

  return res.json();
}

export async function updateRecipeStatus(recipeId, status) {
  const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return res.json();
}