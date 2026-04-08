import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const colors = [
  { label: 'Career Tips', color: 'tag-primary' },
  { label: 'Industry Trends', color: 'tag-purple' },
  { label: 'Learning Guides', color: 'tag-amber' },
];

const posts = [
  { title: 'How to Build an ATS-Friendly Resume', cat: 'Career Tips', date: 'Mar 15, 2025', excerpt: 'Key strategies to get your resume past automated screening and into human hands.' },
  { title: 'AI Is Changing How We Write Code', cat: 'Industry Trends', date: 'Mar 10, 2025', excerpt: 'How AI tools are reshaping development workflows across the industry.' },
  { title: 'Getting Started with Full Stack Dev', cat: 'Learning Guides', date: 'Mar 5, 2025', excerpt: 'A clear roadmap from beginner to job-ready full stack developer.' },
  { title: 'Top React Interview Questions', cat: 'Career Tips', date: 'Feb 28, 2025', excerpt: 'Common questions and how to answer them with confidence.' },
  { title: 'Why Data Science Is Booming', cat: 'Industry Trends', date: 'Feb 20, 2025', excerpt: 'The skills and roles driving explosive growth in data careers.' },
  { title: 'Python vs JavaScript: Which First?', cat: 'Learning Guides', date: 'Feb 15, 2025', excerpt: 'A practical comparison for beginners choosing their first language.' },
];

function categoryClass(category: string) {
  return colors.find((item) => item.label === category)?.color ?? '';
}

export default function BlogPage() {
  const [selected, setSelected] = useState<(typeof posts)[number] | null>(null);

  if (selected) {
    return (
      <main className="pt-nav">
        <section className="section-padding page-hero-section page-hero-blog">
          <div className="container-custom article-wrap">
            <button type="button" onClick={() => setSelected(null)} className="back-link">
              <span className="back-link-icon-wrap">
                <ArrowLeft className="inline-link-icon" />
              </span>
              <span>Back to articles</span>
            </button>
            <Reveal>
              <span className={`post-tag ${categoryClass(selected.cat)}`}>{selected.cat}</span>
              <h1 className="article-title">{selected.title}</h1>
              <p className="article-meta">{selected.date} · DigitBuild Team</p>
              <div className="article-body">
                <p>{selected.excerpt}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-blog">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Blog</SectionEyebrow>
            <SectionTitle as="h1" className="mb-3">Insights &amp; guides</SectionTitle>
            <p className="page-hero-copy left-copy">Tips on careers, tech, and learning.</p>
          </Reveal>
          <h2 className="sr-only">Latest blog posts</h2>
          <div className="card-grid card-grid-3">
            {posts.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.05}>
                <button type="button" onClick={() => setSelected(post)} className="blog-card">
                  <span className={`post-tag ${categoryClass(post.cat)}`}>{post.cat}</span>
                  <h3>{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-footer">
                    <span>{post.date}</span>
                    <span className="inline-link">
                      Read <ArrowRight className="inline-link-icon" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
