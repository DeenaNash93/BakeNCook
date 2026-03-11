export async function getMyClasses() {
  const res = await fetch("http://localhost:5000/api/classes/my", {
    credentials: "include",
  });

  return res.json();
}

export async function cancelRegistration(classId) {
  const res = await fetch(
    `http://localhost:5000/api/classes/${classId}/cancel`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  return res.json();
}