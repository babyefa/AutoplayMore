let videoQueue = JSON.parse(localStorage.getItem("videoQueue") || "[]");
let currentIndex = 0;
let loopPlaylist = false;

function searchVideos() {
  const tags = document.getElementById("tagInput").value;
  fetch(`https://e621.net/posts.json?tags=${encodeURIComponent(tags)}&limit=20`, {
    headers: { 'User-Agent': 'AutoPlay/1.0 (by babyefa on e621)' }
  })
    .then(res => res.json())
    .then(data => {
      videoQueue = data.posts
          .filter(p => ['mp4', 'webm'].includes(p.file.ext))
          .map(p => p.file.url);

      currentIndex = 0;
      saveQueue();
      playCurrent();
      updateQueueList();
    });
}

function queueVideoByURL() {
  const urlInput = document.getElementById("urlInput").value;
  const match = urlInput.match(/e621\\.net\\/posts\\/(\\d+)/);
  if (!match) return alert("Invalid e621 post URL");

  const postId = match[1];
  fetch(`http://localhost:3000/post/${postId}`)
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        videoQueue.push(data.url);
        saveQueue();
        updateQueueList();
        if (videoQueue.length === 1) playCurrent();
      } else {
        alert("This post does not contain a video.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Trying to queue post ID: " + postId);
    });
}


function playCurrent() {
  const video = document.getElementById("videoPlayer");
  if (videoQueue[currentIndex]) {
    video.src = videoQueue[currentIndex];
    video.load();
    video.play();
  }
}

document.getElementById("videoPlayer").addEventListener("ended", () => {
  currentIndex++;
  if (currentIndex < videoQueue.length) {
    playCurrent();
  } else if (loopPlaylist) {
    currentIndex = 0;
    playCurrent();
  }
});

function updateQueueList() {
  const list = document.getElementById("queueList");
  list.innerHTML = "";
  videoQueue.forEach((url, i) => {
    const li = document.createElement("li");
    li.textContent = `Video ${i + 1}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      videoQueue.splice(i, 1);
      if (i <= currentIndex && currentIndex > 0) currentIndex--;
      saveQueue();
      updateQueueList();
    };
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function shuffleQueue() {
  for (let i = videoQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [videoQueue[i], videoQueue[j]] = [videoQueue[j], videoQueue[i]];
  }
  currentIndex = 0;
  saveQueue();
  updateQueueList();
}

function toggleLoop() {
  loopPlaylist = !loopPlaylist;
  document.getElementById("loopButton").textContent = loopPlaylist ? "Loop: ON" : "Loop: OFF";
}

function saveQueue() {
  localStorage.setItem("videoQueue", JSON.stringify(videoQueue));
}

document.addEventListener("DOMContentLoaded", () => {
  updateQueueList();
  if (videoQueue.length > 0) playCurrent();
});
