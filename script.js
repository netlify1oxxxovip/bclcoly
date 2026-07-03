script.jsconst POSTS_DIR = 'posts/';

// Ambil daftar file di folder posts (menggunakan GitHub API)
async function loadPosts() {
  const listContainer = document.getElementById('posts-list');
  listContainer.innerHTML = '<p>Memuat postingan...</p>';

  try {
    // GitHub API untuk list file di folder posts
    const response = await fetch('https://api.github.com/repos/USERNAME/REPO-NAME/contents/posts');
    const files = await response.json();

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    let html = '<h2>Daftar Postingan</h2>';
    
    for (const file of mdFiles) {
      const title = file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');
      html += `
        <div class="post-item">
          <h3><a href="#" onclick="loadPost('${file.name}'); return false;">${title}</a></h3>
          <small>${file.name.split('-').slice(0,3).join('-')}</small>
        </div>`;
    }

    listContainer.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch (e) {
    listContainer.innerHTML = '<p>Gagal memuat daftar postingan. Cek nama repo/username.</p>';
  }
}

async function loadPost(filename) {
  document.getElementById('posts-list').style.display = 'none';
  const contentDiv = document.getElementById('post-content');
  contentDiv.style.display = 'block';

  const rawUrl = `https://raw.githubusercontent.com/USERNAME/REPO-NAME/main/posts/${filename}`;
  
  try {
    const res = await fetch(rawUrl);
    const markdown = await res.text();
    
    // Render Markdown ke HTML
    document.getElementById('content').innerHTML = marked.parse(markdown);
  } catch (e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'block';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan saat halaman dimuat
loadPosts();