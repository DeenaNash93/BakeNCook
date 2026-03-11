export async function getAllClasses() {
  const res = await fetch("http://localhost:5000/api/classes", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function registerToClass(classId) {
  const res = await fetch(`http://localhost:5000/api/classes/${classId}/register`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}

export async function cancelClassRegistration(classId) {
  const res = await fetch(`http://localhost:5000/api/classes/${classId}/cancel`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}