const USERNAME = 'netlify1oxxxovip';
const REPO_NAME = 'bclcoly';

async function loadPosts() {
  const container = document.getElementById('posts-list');
  container.innerHTML = '<p>Memuat daftar film...</p>';

  try {
    const listRes = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/posts`);
    const files = await listRes.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    let html = '';

    for (const file of mdFiles) {
      const filename = file.name;
      const cleanTitle = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');

      // Ambil isi file md untuk mencari gambar pertama
      let imageUrl = 'https://via.placeholder.com/300x250/ff4f9a/fff?text=No+Image';
      
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`);
        const markdown = await rawRes.text();

        // Cari gambar pertama di markdown
        const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      } catch(e) {
        console.log("Gagal ambil gambar untuk:", filename);
      }

      html += `
        <div class="card" onclick="loadPost('${filename}')">
          <img src="${imageUrl}" alt="${cleanTitle}" 
               onerror="this.src='https://via.placeholder.com/300x250/ff4f9a/fff?text=No+Image'">
          <div class="info">
            <div class="title">${cleanTitle}</div>
          </div>
        </div>`;
    }

    container.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch(e) {
    container.innerHTML = '<p>Gagal memuat daftar. Cek koneksi atau repo.</p>';
  }
}

async function loadPost(filename) {
  document.getElementById('posts-list').style.display = 'none';
  const contentArea = document.getElementById('post-content');
  contentArea.style.display = 'block';

  document.getElementById('content').innerHTML = `
    <div style="text-align:center;padding:60px 20px;">
      <div style="width:50px;height:50px;border:4px solid #ddd;border-top:4px solid #ff4f9a;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div>
      <p>Memuat konten...</p>
    </div>`;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
    const res = await fetch(rawUrl);
    const text = await res.text();
    document.getElementById('content').innerHTML = marked.parse(text);
  } catch(e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'grid';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan
loadPosts();
