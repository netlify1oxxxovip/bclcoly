const USERNAME = 'netlify1oxxxovip';
const REPO_NAME = 'bclcoly';

async function loadPosts() {
  const container = document.getElementById('posts-list');
  container.innerHTML = '<p>Memuat daftar film...</p>';

  try {
    const res = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/posts`);
    const files = await res.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    let html = '';
    for (const file of mdFiles) {
      const title = file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');
      html += `
        <div class="card" onclick="loadPost('${file.name}')">
          <img src="https://via.placeholder.com/300x250/ff4f9a/fff?text=${encodeURIComponent(title.substring(0,15))}" alt="${title}">
          <div class="info">
            <div class="title">${title}</div>
          </div>
        </div>`;
    }
    container.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch(e) {
    container.innerHTML = '<p>Gagal memuat daftar.</p>';
  }
}

async function loadPost(filename) {
  document.getElementById('posts-list').style.display = 'none';
  const contentArea = document.getElementById('post-content');
  contentArea.style.display = 'block';
  document.getElementById('content').innerHTML = '<p>Memuat konten...</p>';

  try {
    const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
    const res = await fetch(rawUrl);
    let markdown = await res.text();

    // Jika postingan mengandung base64 (seperti pola kamu)
    if (markdown.includes('window.mewmew') || markdown.includes('atob')) {
      document.getElementById('content').innerHTML = marked.parse(markdown);
    } else {
      // Render normal markdown
      document.getElementById('content').innerHTML = marked.parse(markdown);
    }
  } catch(e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat konten.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'grid';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan
loadPosts();
