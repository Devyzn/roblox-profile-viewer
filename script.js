async function searchUser() {
  const username = document.getElementById("usernameInput").value.trim();
  const profileContainer = document.getElementById("profile");
  const errorContainer = document.getElementById("error");
  profileContainer.innerHTML = "";
  errorContainer.innerHTML = "";

  if (!username) {
    errorContainer.textContent = "Please enter a username.";
    return;
  }

  try {
    const userRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    const userData = await userRes.json();
    if (!userData || !userData.data || userData.data.length === 0) {
      errorContainer.textContent = "User not found.";
      return;
    }

    const user = userData.data[0];
    const userId = user.id;

    const [avatarRes, friendsRes, followersRes, followingRes, profileRes] = await Promise.all([
      fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
      fetch(`https://friends.roblox.com/v1/users/${userId}/followings/count`),
      fetch(`https://users.roblox.com/v1/users/${userId}`)
    ]);

    const [avatarData, friendsCount, followersCount, followingCount, profileInfo] = await Promise.all([
      avatarRes.json(),
      friendsRes.json(),
      followersRes.json(),
      followingRes.json(),
      profileRes.json()
    ]);

    const joinDate = new Date(profileInfo.created).toDateString();
    const accountAge = Math.floor((Date.now() - new Date(profileInfo.created)) / (365.25 * 24 * 60 * 60 * 1000));

    profileContainer.innerHTML = `
      <div class="profile-header">
        <img src="${avatarData.data[0].imageUrl}" alt="Avatar">
        <div>
          <h2>${profileInfo.displayName} (@${profileInfo.name})</h2>
          <p>Status: ${profileInfo.status || "No status set."}</p>
          <p>Bio: ${profileInfo.description || "No bio available."}</p>
          <p>Account Age: ${accountAge} years</p>
          <p>Joined: ${joinDate}</p>
          <div class="stat-box">
            <p>Friends: ${friendsCount.count}</p>
            <p>Followers: ${followersCount.count}</p>
            <p>Following: ${followingCount.count}</p>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    errorContainer.textContent = "An error occurred. Check the console for details.";
  }
}
