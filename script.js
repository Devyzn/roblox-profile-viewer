const proxyBase = "https://your-proxy-host.com"; // Replace with your deployed proxy URL

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
    const userRes = await fetch(`${proxyBase}/api/resolve-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] }),
    });

    const userData = await userRes.json();
    if (!userData || !userData.data || userData.data.length === 0) {
      errorContainer.textContent = "User not found.";
      return;
    }

    const user = userData.data[0];
    const userId = user.id;

    // Continue fetching avatar, friends, etc. directly if CORS allows it;
    // or proxy those too through your backend
  } catch (err) {
    console.error(err);
    errorContainer.textContent = "An error occurred. Check the console for details.";
  }
}
