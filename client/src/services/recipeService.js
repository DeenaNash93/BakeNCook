export async function getApprovedRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes", {
    credentials: "include",
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function getMyRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes/my", {
    credentials: "include",
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
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

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function uploadRecipeImage(recipeId, imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(
    `http://localhost:5000/api/recipes/${recipeId}/upload-image`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function adminReplaceRecipeImage(recipeId, imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(
    `http://localhost:5000/api/recipes/${recipeId}/image`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function getPendingRecipes() {
  const res = await fetch("http://localhost:5000/api/recipes/pending", {
    credentials: "include",
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function updateRecipeStatus(recipeId, status) {
  const res = await fetch(
    `http://localhost:5000/api/recipes/${recipeId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}

export async function deleteRecipe(recipeId) {
  const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    ...data,
  };
}