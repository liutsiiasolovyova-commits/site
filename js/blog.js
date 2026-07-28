// Blog posts loader - reads .md files from blog/ folder

const BLOG_PATH = 'blog/';

// ============================================
// КАК ДОБАВИТЬ НОВУЮ СТАТЬЮ:
// 1. Создайте .md файл в папке blog/
// 2. Добавьте файл в список files ниже
// ============================================

// Fallback posts (used if fetch fails)
const fallbackPosts = [
    {
        slug: 'anxiety',
        title: 'Как справиться с тревожностью',
        date: '2026-07-15',
        excerpt: 'Тревожность стала постоянным спутником многих. В этой статье разбираемся, что такое тревога и как с ней справляться.',
        tags: ['тревожность', 'саморазвитие', 'стресс'],
        content: `
## Что такое тревожность?

Тревожность — это состояние повышенного беспокойства и страха перед будущим. Это нормальная реакция организма на стресс, но когда она становится постоянной, это может мешать жить полноценно.

## Признаки тревожности

- Постоянное чувство беспокойства
- Напряжение в теле
- Нарушения сна
- Трудности с концентрацией
- Учащённое сердцебиение

## Как справиться?

### 1. Дыхательные практики

Глубокое дыхание помогает успокоить нервную систему. Попробуйте технику **4-7-8**: вдох на 4 счёта, задержка на 7, выдох на 8.

### 2. Физическая активность

Регулярные упражнения снижают уровень кортизола — гормона стресса.

### 3. Осознанность

Медитация и практики осознанности помогают быть в настоящем моменте.

### 4. Обращение к специалисту

Если тревога мешает жизни, важно обратиться к психологу.

> «Тревога — это как качели: можно научиться управлять ею, а не позволять ей управлять вами.»

## Заключение

Тревожность поддаётся контролю. Главное — не запускать проблему и работать над собой.
        `
    },
    {
        slug: 'teenager-relations',
        title: 'Как наладить отношения с подростком',
        date: '2026-07-20',
        excerpt: 'Подростковый возраст — сложный период для всей семьи. Как найти общий язык с ребёнком?',
        tags: ['отношения', 'подростки', 'семья'],
        content: `
## Почему подростки отдаляются?

В подростковом возрасте ребёнок начинает формировать свою идентичность. Это естественный процесс отделения от родителей.

## Что делать?

### Слушайте больше, чем говорите

Подростку важно, чтобы его слышали. Не спешите с советами — сначала выслушайте.

### Уважайте границы

У подростка должно быть личное пространство — и физическое, и эмоциональное.

### Избегайте критики

Вместо критики — поддержка. Подросток нуждается в вашей вере в него.

### Будьте примером

Дети учатся через наблюдение. Покажите, как справляться с трудностями.

## Когда обращаться к специалисту?

Если конфликты в семье стали невыносимыми, или подросток замкнулся в себе — это повод обратиться к психологу.
        `
    },
    {
        slug: 'what-does-psychologist-do',
        title: 'Чем занимается психолог?',
        date: '2026-07-25',
        excerpt: 'Разбираемся, чем психолог отличается от психиатра и как проходит консультация.',
        tags: ['психология', 'консультация'],
        content: `
## Психолог и психиатр — в чём разница?

- **Психолог** — специалист с высшим психологическим образованием, который работает с помощью беседы. Не назначает лекарства.

- **Психиатр** — врач, который может назначать медикаменты. Работает с психическими расстройствами.

## Что делает психолог?

На консультации психолог:
- Слушает вас
- Задаёт вопросы
- Помогает разобраться в себе
- Даёт инструменты для работы над собой

## Как проходит консультация?

Первая консультация — знакомство. Вы рассказываете о своей ситуации, психолог слушает и задаёт вопросы. В конце определяем цели и план работы.

## Сколько нужно консультаций?

Это индивидуально. Кому-то достаточно 5-10 сессий, кому-то нужна более длительная работа. Главное — ваше желание работать над собой.
        `
    }
];

// Список .md файлов статей (для GitHub Pages)
const files = [
    'anxiety.md',
    'teenager-relations.md',
    'what-does-psychologist-do.md'
];

// Simple markdown to HTML converter
function mdToHtml(md) {
    let html = md;
    
    // Code blocks
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
    
    // Paragraphs
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
    
    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    
    return html;
}

// Parse frontmatter (Obsidian compatible)
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return { meta: {}, content: content };
    }
    
    const frontmatter = match[1];
    const body = match[2];
    const meta = {};
    
    let currentKey = null;
    let arrayItems = [];
    
    frontmatter.split('\n').forEach(line => {
        // Check for array start: tags: [tag1, tag2]
        const arrayInline = line.match(/^(\w+):\s*\[(.*)\]\s*$/);
        if (arrayInline) {
            meta[arrayInline[1]] = arrayInline[2].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
            currentKey = null;
            return;
        }
        
        // Check for key: value
        const kvMatch = line.match(/^(\w+):\s*(.*)\s*$/);
        if (kvMatch) {
            // Save previous array if any
            if (currentKey && arrayItems.length > 0) {
                meta[currentKey] = arrayItems;
                arrayItems = [];
            }
            
            currentKey = kvMatch[1];
            const value = kvMatch[2].trim();
            
            if (value === '' || value === '[]') {
                // Start of array (empty or next lines)
                arrayItems = [];
            } else {
                meta[currentKey] = value.replace(/^["']|["']$/g, '');
                currentKey = null;
            }
            return;
        }
        
        // Check for array item: - item
        const arrayItem = line.match(/^\s+-\s+(.*)\s*$/);
        if (arrayItem && currentKey) {
            arrayItems.push(arrayItem[1].trim().replace(/^["']|["']$/g, ''));
            return;
        }
    });
    
    // Save last array if any
    if (currentKey && arrayItems.length > 0) {
        meta[currentKey] = arrayItems;
    }
    
    return { meta, content: body };
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Fetch blog posts
async function fetchBlogPosts() {
    const posts = [];
    
    // Try to load from .md files
    const loadPromises = files.map(async (file) => {
        try {
            const response = await fetch(BLOG_PATH + file);
            if (!response.ok) return null;
            const text = await response.text();
            const { meta, content } = parseFrontmatter(text);
            
            const slug = file.replace('.md', '');
            
            return {
                slug,
                title: meta.title || slug,
                date: meta.date || '',
                excerpt: meta.excerpt || content.substring(0, 150).replace(/[#*\n]/g, '').trim() + '...',
                tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? meta.tags.split(',').map(t => t.trim()) : []),
                content
            };
        } catch (e) {
            return null;
        }
    });
    
    const results = await Promise.all(loadPromises);
    results.forEach(post => {
        if (post) posts.push(post);
    });
    
    // If no posts loaded, use fallback
    if (posts.length === 0) {
        return fallbackPosts;
    }
    
    // Sort by date
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
                        <div class="blog-empty">Статей пока нет.</div>
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
        console.error(e);
        blogContent.innerHTML = `
            <div class="container section">
                <h1 class="section-title">Блог</h1>
                <div class="blog-list">
                    <div class="error">Ошибка загрузки статей</div>
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
    
    // Try .md file first
    try {
        const response = await fetch(BLOG_PATH + slug + '.md');
        if (response.ok) {
            const text = await response.text();
            const { meta, content } = parseFrontmatter(text);
            
            const html = `
                <article class="blog-article">
                    <a href="blog.html" class="back-link">← Назад к блогу</a>
                    <header class="blog-article__header">
                        <div class="blog-article__date">${formatDate(meta.date)}</div>
                        <h1 class="blog-article__title">${meta.title || slug}</h1>
                        ${meta.tags ? `<div class="blog-card__tags">${(Array.isArray(meta.tags) ? meta.tags : meta.tags.split(',')).map(tag => `<span class="blog-tag">#${tag.trim()}</span>`).join('')}</div>` : ''}
                    </header>
                    <div class="blog-article__content">
                        ${mdToHtml(content)}
                    </div>
                </article>
            `;
            
            blogContent.innerHTML = html;
            return;
        }
    } catch (e) {
        // Try fallback
    }
    
    // Try fallback posts
    const post = fallbackPosts.find(p => p.slug === slug);
    if (post) {
        const html = `
            <article class="blog-article">
                <a href="blog.html" class="back-link">← Назад к блогу</a>
                <header class="blog-article__header">
                    <div class="blog-article__date">${formatDate(post.date)}</div>
                    <h1 class="blog-article__title">${post.title}</h1>
                    <div class="blog-card__tags">
                        ${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
                    </div>
                </header>
                <div class="blog-article__content">
                    ${mdToHtml(post.content)}
                </div>
            </article>
        `;
        blogContent.innerHTML = html;
        return;
    }
    
    blogContent.innerHTML = `
        <div class="container">
            <div class="error">Статья не найдена</div>
            <a href="blog.html" class="back-link">← Назад к блогу</a>
        </div>
    `;
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
