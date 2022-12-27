document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const userList = document.getElementById('user-list');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    userList.innerHTML = "";

    fetchUsers();
  });

  function fetchUsers() {
    const searchTerm = searchInput.value;
    fetch(`https://api.github.com/search/users?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => renderUsers(data));
  }

  function renderUsers(data) {
    data.items.forEach(user => {
      const users = document.createElement('li');
      users.innerHTML = `${user.login}&nbsp;`;
      users.id = user.login; // Add an id attribute to the li element
      userList.append(users);

      const avatars = document.createElement('img');
      avatars.src = user.avatar_url;
      userList.append(avatars);

      const profileLink = document.createElement('a');
      profileLink.href = user.html_url;
      profileLink.textContent = user.html_url;
      users.appendChild(profileLink);
    });

    // Add event listeners to each li element to retrieve repository data
    userList.querySelectorAll('li').forEach(li => { //adds an event listener for each li element
      li.addEventListener('click', () => {
        const username = li.id; 
        fetch(`https://api.github.com/users/${username}/repos`)
          .then(response => response.json())
          .then(data => {
            // Clear the existing repository list
            li.querySelectorAll('ul').forEach(ul => ul.remove());

            // Create a new ul element for the repository list
            const repoList = document.createElement('ul');
            data.forEach(repo => {
              const repoItem = document.createElement('li');
              repoItem.textContent = repo.name;
              repoList.append(repoItem);
            });

            // Append the repository list to the user's li element
            li.append(repoList);
          });
      });
    });
  }
});
