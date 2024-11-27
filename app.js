const tableBody = document.querySelector(".crudTable tbody");
const form = document.querySelector("#userForm");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");

let currentUsers = [];
async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    currentUsers = await response.json();
    renderTable(currentUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function renderTable(users) {
  tableBody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button class="edit" data-id="${user.id}">Edit</button>
        <button class="delete" data-id="${user.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  document.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => editUser(btn.dataset.id));
  });
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteUser(btn.dataset.id));
  });
}

async function addUser(user) {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to add user");
    console.log("User added");
    getUsers();
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

async function editUser(userId) {
  try {
    const user = currentUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    nameInput.value = user.name;
    emailInput.value = user.email;

    form.onsubmit = async (e) => {
      e.preventDefault();
      await updateUser(userId, {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
      });
      form.reset();
      form.onsubmit = handleAddUser;
    };
  } catch (error) {
    console.error(error);
  }
}

async function updateUser(userId, updatedData) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    console.log("User updated");
    getUsers();
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
    console.log("User deleted");
    getUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

function handleAddUser(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  if (name && email) {
    addUser({ name, email });
    form.reset();
  } else {
    alert("Please fill out all fields.");
  }
}
form.addEventListener("submit", handleAddUser);

getUsers();
