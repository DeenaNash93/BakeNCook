export async function getAdminStats() {
  const res = await fetch("http://localhost:5000/api/admin/stats", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}