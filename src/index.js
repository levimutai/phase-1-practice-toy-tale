let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render all toys on page load
  fetchToys();

  // Handle new toy form submission
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', handleNewToySubmit);
});

// Fetch and render all toys
function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    });
}

// Render a single toy card
function renderToyCard(toy) {
  const toyCollection = document.getElementById('toy-collection');
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add event listener for the like button
  card.querySelector('.like-btn').addEventListener('click', () => handleLike(toy, card));

  toyCollection.appendChild(card);
}

// Handle new toy form submission
function handleNewToySubmit(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(newToy => {
      renderToyCard(newToy);
      event.target.reset();
    });
}

// Handle like button click
function handleLike(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(resp => resp.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // update local toy object
      card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
    });
}