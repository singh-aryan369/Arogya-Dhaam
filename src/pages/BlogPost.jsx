import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Activity, Clock3, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { posts } from '../data/blog.js';
import './Blog.css';

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

export default function BlogPost() {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <section className="section">
        <div className="container-narrow" style={{ textAlign: 'center', padding: '80px 0' }}>
          <p className="eyebrow">Article not found</p>
          <h1 style={{ marginBottom: 24 }}>We couldn't find that one.</h1>
          <Link to="/blog" className="btn btn-primary"><ChevronLeft size={16} aria-hidden="true" /> Back to all articles</Link>
        </div>
      </section>
    );
  }

  const initials = post.author.split(' ').slice(-2).map(p => p[0]).join('');

  return (
    <>
      <PageHeader eyebrow={post.category} title={post.title} />
      <section className="section">
        <div className="container-narrow">
          <Reveal y={16}>
            <p className="post-meta">
              <span><Calendar size={14} aria-hidden="true" /> {fmt(post.date)}</span>
              <span><Clock3 size={14} aria-hidden="true" /> {post.readMins} min read</span>
              <span><Activity size={14} aria-hidden="true" /> {post.category}</span>
            </p>

            <div className="post-author">
              <div className="post-author__avatar" aria-hidden="true">{initials}</div>
              <p>
                <strong>{post.author}</strong>
                <span>{post.role}</span>
              </p>
            </div>
          </Reveal>

          <Stagger as="div" className="post-body" delay={0.05}>
            {post.body.split('\n\n').map((para, i) => (
              <StaggerItem key={i} as="p">{para}</StaggerItem>
            ))}
          </Stagger>

          <Reveal y={16} delay={0.1} style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/blog" className="btn btn-ghost"><ChevronLeft size={16} aria-hidden="true" /> All articles</Link>
            <Link to="/appointments" className="btn btn-primary">Book a consultation</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
