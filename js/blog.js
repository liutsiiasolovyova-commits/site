// Blog posts loader - reads .md files from blog/ folder

const BLOG_PATH = 'blog/';

// Simple markdown to HTML converter
function mdToHtml(md) {
    let html = md;
    
    // Code blocks (must be first)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr>');
    
    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Paragraphs - split by double newlines
    const blocks = html.split(/\n\n+/);
    html = '';
    blocks.forEach(block => {
        block = block.trim();
        if (!block) return;
        if (block.match(/^<(h[1-4]|ul|ol|blockquote|pre|hr|img|div)/i)) {
            html += block + '\n';
        } else {
            html += '<p>' + block.replace(/\n/g, '<br>') + '</p>\n';
        }
    });
    
    // Clean up empty paragraphs and extra breaks
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ol>)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)/g, '$1');
    html = html.replace(/(<hr>)<\/p>/g, '$1');
    
    return html;
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return {
            meta: {},
            content: content
        };
    }
    
    const frontmatter = match[1];
    const body = match[2];
    const meta = {};
    
    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');
            meta[key.trim()] = value;
        }
    });
    
    return { meta, content: body };
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Fetch all markdown files from blog folder
async function fetchBlogPosts() {
    const posts = [];
    
    // ============================================
    // КАК ДОБАВИТЬ НОВУЮ СТАТЬЮ:
    // 1. Создайте .md файл в папке blog/
    // 2. Добавьте файл в список files ниже
    // ============================================
    
    // Список .md файлов статей
    const files = [
        'anxiety.md',
        'teenager-relations.md',
        'what-does-psychologist-do.md'
    ];
    
    const loadPromises = files.map(async (file) => {
        try {
            const response = await fetch(BLOG_PATH + file);
            if (!response.ok) return null;
            const text = await response.text();
            const { meta, content } = parseFrontmatter(text);
            
            // Generate slug from filename
            const slug = file.replace('.md', '');
            
            return {
                slug,
                title: meta.title || slug,
                date: meta.date || '',
                excerpt: meta.excerpt || content.substring(0, 150).replace(/[#*\n]/g, '').trim() + '...',
                tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
                content
            };
        } catch (e) {
            console.error('Error loading', file, e);
            return null;
        }
    });
    
    const results = await Promise.all(loadPromises);
    results.forEach(post => {
        if (post) posts.push(post);
    });
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
}

// Render blog list
async function renderBlogList() {
    const blogContent = document.getElementById('blogContent');
    if (!blogContent) return;
    
    blogContent.innerHTML = '<div class="container section"><h1 class="section-title">Блог</h1><div class="blog-list"><div class="loading">Загрузка статей...</div></div></div>';
    
    try {
        const posts = await fetchBlogPosts();
        
        if (posts.length === 0) {
            blogContent.innerHTML = `
                <div class="container section">
                    <h1 class="section-title">Блог</h1>
                    <div class="blog-list">
                        <div class="blog-empty">
                            <p>Статей пока нет.</p>
                            <p>Чтобы добавить статью, создайте .md файл в папке <code>blog/</code></p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = '<div class="container section"><h1 class="section-title">Блог</h1><div class="blog-list">';
        
        posts.forEach(post => {
            html += `
                <article class="blog-card">
                    <div class="blog-card__date">${formatDate(post.date)}</div>
                    <h2 class="blog-card__title"><a href="blog.html?post=${post.slug}">${post.title}</a></h2>
                    <p class="blog-card__excerpt">${post.excerpt}</p>
                    <div class="blog-card__tags">
                        ${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
                    </div>
                </article>
            `;
        });
        
        html += '</div></div>';
        blogContent.innerHTML = html;
    } catch (e) {
        blogContent.innerHTML = `
            <div class="container section">
                <h1 class="section-title">Блог</h1>
                <div class="blog-list">
                    <div class="error">
                        <p>Не удалось загрузить статьи.</p>
                        <p>Для локального просмотра используйте локальный сервер.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Render single post
async function renderPost(slug) {
    const blogContent = document.getElementById('blogContent');
    if (!blogContent) return;
    
    blogContent.innerHTML = '<div class="loading">Загрузка статьи...</div>';
    
    try {
        const response = await fetch(BLOG_PATH + slug + '.md');
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const text = await response.text();
        const { meta, content } = parseFrontmatter(text);
        
        const html = `
            <article class="blog-article">
                <a href="blog.html" class="back-link">← Назад к блогу</a>
                <header class="blog-article__header">
                    <div class="blog-article__date">${formatDate(meta.date)}</div>
                    <h1 class="blog-article__title">${meta.title || slug}</h1>
                    ${meta.tags ? `<div class="blog-card__tags">${meta.tags.split(',').map(tag => `<span class="blog-tag">#${tag.trim()}</span>`).join('')}</div>` : ''}
                </header>
                <div class="blog-article__content">
                    ${mdToHtml(content)}
                </div>
            </article>
        `;
        
        blogContent.innerHTML = html;
    } catch (e) {
        blogContent.innerHTML = `
            <div class="container">
                <div class="error">Статья не найдена</div>
                <a href="blog.html" class="back-link">← Назад к блогу</a>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    if (postSlug) {
        renderPost(postSlug);
    } else {
        renderBlogList();
    }
});
