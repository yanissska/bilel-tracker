const CONFIG = {
    ACCESS_TOKEN: "4b5wtirpol413lhscghkj2qxq6r1l3",
    CLIENT_ID: "yjyctx8pxgogft7jwtznoxym9uj3hy",
    CHANNEL_NAME: "bilel_mlj",
    CHECK_INTERVAL: 60000
};

const elements = {
    banStatus: document.getElementById("ban-status"),
    updateTime: document.getElementById("update-time"),
    profilePic: document.getElementById("profile-pic"),
    displayName: document.getElementById("display-name")
};

async function checkTwitchChannel() {
    setStatus("loading", "Vérification en cours...");
    
    try {
        const [streamData, userData] = await Promise.all([
            fetchTwitchAPI(`streams?user_login=${CONFIG.CHANNEL_NAME}`),
            fetchTwitchAPI(`users?login=${CONFIG.CHANNEL_NAME}`)
        ]);

        if (userData.data?.length > 0) {
            const user = userData.data[0];
            elements.profilePic.src = user.profile_image_url;
            elements.displayName.innerHTML = `${user.display_name} <span class="badge-suspect">⚠️</span>`;
        }

        const isLive = streamData.data?.length > 0;
        setStatus(isLive ? "live" : "not-banned", isLive ? "En direct !" : "Pas encore banni");

    } catch (error) {
        console.error("Erreur:", error);
        setStatus("error", "Erreur de connexion");
    } finally {
        elements.updateTime.textContent = new Date().toLocaleTimeString();
    }
}

async function fetchTwitchAPI(endpoint) {
    const response = await fetch(`https://api.twitch.tv/helix/${endpoint}`, {
        headers: {
            "Client-ID": CONFIG.CLIENT_ID,
            "Authorization": `Bearer ${CONFIG.ACCESS_TOKEN}`
        }
    });
    
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    return await response.json();
}

function setStatus(status, message) {
    elements.banStatus.className = `status-${status}`;
    elements.banStatus.innerHTML = `<span class="status-dot ${status}"></span> ${message}`;
}

document.getElementById("twitch-card").addEventListener("click", checkTwitchChannel);
checkTwitchChannel();
setInterval(checkTwitchChannel, CONFIG.CHECK_INTERVAL);
