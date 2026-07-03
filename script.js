const USERNAME = 'netlify1oxxxovip';
const REPO_NAME = 'bclcoly';

let isUnlocked = false;

async function loadPosts() {
  const listContainer = document.getElementById('posts-list');
  listContainer.innerHTML = '<p>Memuat postingan...</p>';

  try {
    const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/posts`);
    if (!response.ok) throw new Error();
    
    const files = await response.json();
    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    let html = '';
    
    for (const file of mdFiles) {
      const title = file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');
      const date = file.name.split('-').slice(0,3).join('-');
      
      html += `
        <div class="card" onclick="loadPost('${file.name}')">
          <img src="https://via.placeholder.com/300x250?text=${encodeURIComponent(title)}" alt="${title}">
          <div class="info">
            <div class="title">${title}</div>
            <small>${date}</small>
          </div>
        </div>`;
    }

    listContainer.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch (e) {
    listContainer.innerHTML = '<p>Gagal memuat. Cek folder posts.</p>';
  }
}

async function loadPost(filename) {
  if (!isUnlocked) {
    const pass = prompt("🔒 Masukkan Password:");
    if (pass !== "2026") {
      alert("❌ Password salah!");
      return;
    }
    isUnlocked = true;
  }

  document.getElementById('posts-list').style.display = 'none';
  const contentDiv = document.getElementById('post-content');
  contentDiv.style.display = 'block';

  const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
  
  try {
    const res = await fetch(rawUrl);
    const markdown = await res.text();
    document.getElementById('content').innerHTML = marked.parse(markdown);
  } catch (e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'grid';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan
loadPosts();
