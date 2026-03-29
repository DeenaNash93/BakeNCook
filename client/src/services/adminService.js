export async function getAdminStats() {
  const res = await fetch("http://localhost:5000/api/admin/stats", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function blockUser(userId) {
  const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}

export async function unblockUser(userId) {
  const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/unblock`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}