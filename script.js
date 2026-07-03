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
      const cleanTitle = file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');
      const displayTitle = cleanTitle.length > 25 ? cleanTitle.substring(0, 22) + '...' : cleanTitle;
      
      // Gunakan placeholder yang lebih reliable
      html += `
        <div class="card" onclick="loadPost('${file.name}')">
          <img src="https://picsum.photos/300/250?random=${Math.random()}" 
               alt="${cleanTitle}"
               onerror="this.src='https://via.placeholder.com/300x250/ff4f9a/ffffff?text=No+Image'">
          <div class="info">
            <div class="title">${displayTitle}</div>
          </div>
        </div>`;
    }
    container.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch(e) {
    container.innerHTML = '<p>Gagal memuat daftar postingan.</p>';
  }
}

async function loadPost(filename) {
  document.getElementById('posts-list').style.display = 'none';
  const contentArea = document.getElementById('post-content');
  contentArea.style.display = 'block';
  document.getElementById('content').innerHTML = `
    <div style="text-align:center; padding:50px;">
      <div style="width:50px;height:50px;border:4px solid #ddd;border-top:4px solid #ff4f9a;border-radius:50%;animation:spin 1s linear infinite;margin:auto;"></div>
      <p>Memuat konten...</p>
    </div>`;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
    const res = await fetch(rawUrl);
    let text = await res.text();

    document.getElementById('content').innerHTML = marked.parse(text);
  } catch(e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan. Coba refresh.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'grid';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan saat halaman dimuat
loadPosts();
