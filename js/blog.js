// Blog posts data - add new posts here
const blogPosts = [
    {
        slug: 'kak-spravitsya-s-trevozhnostyu',
        title: 'Как справиться с тревожностью',
        date: '2026-07-15',
        excerpt: 'Тревожность стала постоянным спутником многих. В этой статье разбираемся, что такое тревога и как с ней справляться.',
        tags: ['тревожность', 'саморазвитие'],
        content: `
## Что такое тревожность?

Тревожность — это состояние повышенного беспокойства и страха перед будущим. Это нормальная реакция организма на стресс, но когда она становится постоянной, это может мешать жить полноценно.

## Признаки тревожности

- Постоянное чувство беспокойства
- Напряжение в теле
- Нарушения сна
- Трудности с концентрацией
- Учащённое сердцебиение

## Как справиться

### 1. Дыхательные практики

Глубокое дыхание помогает успокоить нервную систему. Попробуйте технику 4-7-8: вдох на 4 счёта, задержка на 7, выдох на 8.

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
        slug: 'otnosheniya-s-podrostkom',
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
        slug: 'chem-zanimayetsya-psikholog',
        title: 'Чем занимается психолог?',
        date: '2026-07-25',
        excerpt: 'Разбираемся, чем психолог отличается от психиатра и как проходит консультация.',
        tags: ['психология', 'консультация'],
        content: ##
## Психолог и психиатр — в чём разница?

Психолог — это специалист с высшим психологическим образованием, который работает с помощью беседы. Психиатр — врач, который может назначать лекарства.

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

// Simple markdown to HTML converter
function mdToHtml(md) {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[123]>)/g, '$1');
    html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    
    return html;
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Render blog list
function renderBlogList() {
    const blogContent = document.getElementById('blogContent');
    if (!blogContent) return;
    
    let html = '<div class="container section"><h1 class="section-title">Блог</h1><div class="blog-list">';
    
    if (blogPosts.length === 0) {
        html += '<div class="blog-empty">Статьи скоро появятся</div>';
    } else {
        blogPosts.forEach(post => {
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
    }
    
    html += '</div></div>';
    blogContent.innerHTML = html;
}

// Render single post
function renderPost(slug) {
    const blogContent = document.getElementById('blogContent');
    if (!blogContent) return;
    
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
        blogContent.innerHTML = `
            <div class="container">
                <div class="error">Статья не найдена</div>
                <a href="blog.html" class="back-link">← Назад к блогу</a>
            </div>
        `;
        return;
    }
    
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
