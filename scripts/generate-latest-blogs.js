const fs = require('fs');

const blogPosts = JSON.parse(fs.readFileSync('data/blog.json', 'utf8'));

function isPostLive(post) {
  if (!post || post.status === 'draft') return false;
  const publishTimestamp = post.published_at ? new Date(post.published_at).getTime() : NaN;
  if (!isNaN(publishTimestamp) && publishTimestamp > Date.now()) return false;
  if (post.status === 'scheduled') {
    return !isNaN(publishTimestamp) && publishTimestamp <= Date.now();
  }
  return post.status === 'published' || !post.status;
}

const latest4 = blogPosts
  .filter(isPostLive)
  .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  .slice(0, 4)
  .map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    title_tr: p.title_tr || p.title || p.title_en,
    title_en: p.title_en || p.title,
    title_de: p.title_de || p.title_en || p.title,
    title_pl: p.title_pl || p.title_en || p.title,
    title_fr: p.title_fr || p.title_en || p.title,
    title_es: p.title_es || p.title_en || p.title,
    excerpt: p.excerpt,
    excerpt_tr: p.excerpt_tr || p.excerpt || p.excerpt_en,
    excerpt_en: p.excerpt_en || p.excerpt,
    excerpt_de: p.excerpt_de || p.excerpt_en || p.excerpt,
    excerpt_pl: p.excerpt_pl || p.excerpt_en || p.excerpt,
    excerpt_fr: p.excerpt_fr || p.excerpt_en || p.excerpt,
    excerpt_es: p.excerpt_es || p.excerpt_en || p.excerpt,
    category: p.category,
    category_tr: p.category_tr || p.category || p.category_en,
    category_en: p.category_en || p.category,
    category_de: p.category_de || p.category_en || p.category,
    category_pl: p.category_pl || p.category_en || p.category,
    category_fr: p.category_fr || p.category_en || p.category,
    category_es: p.category_es || p.category_en || p.category,
    published_at: p.published_at,
    read_time: p.read_time || '5',
    featured_image: p.featured_image
  }));

fs.writeFileSync('data/latest-blogs.json', JSON.stringify(latest4, null, 2), 'utf8');
console.log('Generated data/latest-blogs.json: ' + (fs.statSync('data/latest-blogs.json').size / 1024).toFixed(1) + ' KB (was 301 KB)');
