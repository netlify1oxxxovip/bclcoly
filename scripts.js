const POSTS_DIR = 'posts/';

// GANTI BAGIAN INI SESUAI REPO KAMU
const USERNAME = 'netlify1oxxxovip';
const REPO_NAME = 'bclcoly';

async function loadPosts() {
  const listContainer = document.getElementById('posts-list');
  listContainer.innerHTML = '<p>Memuat postingan...</p>';

  try {
    // GitHub API yang BENAR
    const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/posts`);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    
    const files = await response.json();
    
    // Filter hanya file .md
    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    let html = '<h2>Daftar Postingan</h2>';
   
    for (const file of mdFiles) {
      const title = file.name
        .replace(/^\d{4}-\d{2}-\d{2}-/, '') 
        .replace('.md', '') 
        .replace(/-/g, ' ');
      
      html += `
        <div class="post-item">
          <h3><a href="#" onclick="loadPost('${file.name}'); return false;">${title}</a></h3>
          <small>${file.name.split('-').slice(0,3).join('-')}</small>
        </div>`;
    }

    listContainer.innerHTML = html || '<p>Belum ada postingan.</p>';
  } catch (e) {
    console.error(e);
    listContainer.innerHTML = `<p>Gagal memuat daftar postingan.<br><small>Cek apakah folder "posts" sudah ada dan berisi file .md</small></p>`;
  }
}

async function loadPost(filename) {
  document.getElementById('posts-list').style.display = 'none';
  const contentDiv = document.getElementById('post-content');
  contentDiv.style.display = 'block';

  const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${REPO_NAME}/main/posts/${filename}`;
 
  try {
    const res = await fetch(rawUrl);
    const markdown = await res.text();
   
    document.getElementById('content').innerHTML = marked.parse(markdown);
  } catch (e) {
    document.getElementById('content').innerHTML = '<p>Gagal memuat postingan. Cek nama file.</p>';
  }
}

function backToList() {
  document.getElementById('posts-list').style.display = 'block';
  document.getElementById('post-content').style.display = 'none';
}

// Jalankan saat halaman dimuat
loadPosts();
