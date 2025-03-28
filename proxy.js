// proxy.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/post/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const response = await axios.get(`https://e621.net/posts/${postId}.json`, {
      headers: {
        'User-Agent': 'AutoplayLocalProxy/1.0 (by babyefa on e621)'
      }
    });

    const post = response.data.post;

    if (post && post.file && ['mp4', 'webm'].includes(post.file.ext)) {
      res.json({ url: post.file.url });
    } else {
      res.status(404).json({ error: 'No video found in post.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post data.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
});
