export async function getProfile() {
  const res = await fetch("http://localhost:5000/api/user/profile", {
    credentials: "include",
  });

  return res.json();
}