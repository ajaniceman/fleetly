import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css'; // Import the CSS for the blog page
import { useTranslation } from 'react-i18next';

// Mock blog post data (using translation keys for content)
const blogPosts = [
  {
    id: 1,
    image: 'https://placehold.co/600x400/3498db/ffffff?text=Fleet+Optimisation',
    titleKey: 'blog_post_1_title',
    excerptKey: 'blog_post_1_excerpt',
    dateKey: 'blog_post_1_date',
    authorKey: 'blog_post_1_author',
    slug: 'fleet-optimisation-strategies', // Unique slug for URL
  },
  {
    id: 2,
    image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Preventative+Maintenance',
    titleKey: 'blog_post_2_title',
    excerptKey: 'blog_post_2_excerpt',
    dateKey: 'blog_post_2_date',
    authorKey: 'blog_post_2_author',
    slug: 'importance-of-preventative-maintenance',
  },
  {
    id: 3,
    image: 'https://placehold.co/600x400/e74c3c/ffffff?text=Safety+Tips',
    titleKey: 'blog_post_3_title',
    excerptKey: 'blog_post_3_excerpt',
    dateKey: 'blog_post_3_date',
    authorKey: 'blog_post_3_author',
    slug: 'driver-safety-tips',
  },
  {
    id: 4,
    image: 'https://placehold.co/600x400/9b59b6/ffffff?text=Cost+Saving',
    titleKey: 'blog_post_4_title',
    excerptKey: 'blog_post_4_excerpt',
    dateKey: 'blog_post_4_date',
    authorKey: 'blog_post_4_author',
    slug: 'cost-saving-fleet-management',
  },
];

export default function Blog() {
  const { t } = useTranslation();

  return (
    <div className="blog-page-container">
      <div className="blog-header">
        <h1>{t('blog_page_title')}</h1>
        <p>{t('blog_page_subtitle')}</p>
      </div>

      <div className="blog-posts-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={t(post.titleKey)} className="blog-card-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/000000?text=Image+Missing"; }}/>
            <div className="blog-card-content">
              <h2>{t(post.titleKey)}</h2>
              <p className="blog-card-excerpt">{t(post.excerptKey)}</p>
              <div className="blog-card-meta">
                <span>{t(post.dateKey)}</span>
                <span>•</span>
                <span>{t(post.authorKey)}</span>
              </div>
              <Link to={`/blog/${post.slug}`} className="read-more-btn">
                {t('read_more_button')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
