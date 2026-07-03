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

      let imageUrl = '';
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`);
        const markdown = await rawRes.text();
        const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
        if (imgMatch && imgMatch[1]) imageUrl = imgMatch[1];
      } catch(e) {}

      const finalImg = imageUrl || 'https://picsum.photos/id/1015/300/250';

      html += `
        <div class="card" onclick="loadPost('${filename}')">
          <img src="${finalImg}" alt="${cleanTitle}" onerror="this.style.display='none';">
          <div class="info">
            <div class="title">${cleanTitle}</div>
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
    <div style="text-align:center;padding:80px 20px;">
      <div class="spinner"></div>
      <p>Memuat konten...</p>
    </div>`;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
    const res = await fetch(rawUrl);
    let text = await res.text();

    // Render HTML + jalankan script di dalamnya
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').appendChild(tempDiv);

    // Eksekusi semua <script> yang ada
    const scripts = tempDiv.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const oldScript = scripts[i];
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.getElementById('content').appendChild(newScript);
    }

  } catch(e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'grid';
  document.getElementById('post-content').style.display = 'none';
}

loadPosts();
