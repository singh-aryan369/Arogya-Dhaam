import { Link } from 'react-router-dom';
import { Activity, ChevronRight, Clock3 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';
import { posts } from '../data/blog.js';
import './Blog.css';

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Blog() {
  const [feature, ...rest] = posts;
  return (
    <>
      <PageHeader
        eyebrow="From the journal"
        title="News &amp; insights from our consultants"
        intro="Plainly written, evidence-based articles on prevention, common conditions, and what we wish more patients knew."
      />

      <section className="section">
        <div className="container">
          <Reveal y={24}>
            <Link to={`/blog/${feature.id}`} className={`blog-feature blog-cover blog-cover--${feature.tone}`}>
              <div className="blog-feature__cover" aria-hidden="true">
                <span className="blog-feature__mark"><Activity size={36} aria-hidden="true" /></span>
              </div>
              <div className="blog-feature__body">
                <p className="blog-meta">{fmt(feature.date)} · {feature.category} · {feature.readMins} min read</p>
                <h2>{feature.title}</h2>
                <p className="blog-feature__excerpt">{feature.excerpt}</p>
                <span className="blog-feature__more">Read article <ChevronRight size={14} aria-hidden="true" /></span>
              </div>
            </Link>
          </Reveal>

          <Stagger className="blog-grid" delay={0.07}>
            {rest.map(p => (
              <StaggerItem key={p.id} as="div" className="blog-card-wrap">
                <Link to={`/blog/${p.id}`} className={`blog-card blog-cover--${p.tone}`}>
                  <div className="blog-card__cover" aria-hidden="true">
                    <span className="blog-card__mark"><Activity size={24} aria-hidden="true" /></span>
                  </div>
                  <div className="blog-card__body">
                    <p className="blog-meta">{fmt(p.date)} · {p.category}</p>
                    <h3>{p.title}</h3>
                    <p className="blog-card__excerpt">{p.excerpt}</p>
                    <p className="blog-card__author"><Clock3 size={12} aria-hidden="true" /> {p.readMins} min read · {p.author}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
