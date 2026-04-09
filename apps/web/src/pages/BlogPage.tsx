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
  {
    title: 'How to Build an ATS-Friendly Resume',
    cat: 'Career Tips',
    date: 'Mar 15, 2025',
    excerpt: 'Key strategies to get your resume past automated screening and into human hands.',
    intro:
      'An ATS-friendly resume is not about stuffing random keywords. It is about making your experience easy for both software and recruiters to understand quickly.',
    sections: [
      {
        heading: 'Start with a clean structure',
        paragraphs: [
          'Use clear section labels like Summary, Skills, Experience, Projects, and Education. Fancy layouts, tables, icons, and multi-column designs often confuse applicant tracking systems and break the reading flow for recruiters.',
          'A clean one-column format with clear headings makes your resume easier to scan in less than thirty seconds, which is usually all the first review gets.',
        ],
      },
      {
        heading: 'Match the job description naturally',
        paragraphs: [
          'Read the role carefully and notice the exact terms the employer uses. If the job asks for React, REST APIs, TypeScript, testing, or stakeholder communication, include those terms where they genuinely reflect your work.',
          'The goal is alignment, not repetition. A recruiter should feel your resume was written for this type of role, not sent to fifty unrelated openings.',
        ],
      },
      {
        heading: 'Show outcomes, not just duties',
        paragraphs: [
          'Instead of writing “worked on frontend development,” write what you built, improved, or delivered. Mention measurable improvements when possible, such as faster load time, improved conversion, reduced errors, or smoother collaboration.',
          'Strong resumes connect tools to results. That is what makes a profile memorable after it passes the ATS filter.',
        ],
      },
    ],
  },
  {
    title: 'AI Is Changing How We Write Code',
    cat: 'Industry Trends',
    date: 'Mar 10, 2025',
    excerpt: 'How AI tools are reshaping development workflows across the industry.',
    intro:
      'AI is not replacing software engineers. It is changing how strong engineers work, review, learn, and deliver software at speed.',
    sections: [
      {
        heading: 'From blank-page work to fast iteration',
        paragraphs: [
          'Developers now use AI to scaffold components, suggest refactors, explain unfamiliar code, and generate first drafts of tests or documentation. That means less time spent starting from zero and more time spent improving quality.',
          'The value is not in copying everything an AI tool gives you. The value is in reviewing, correcting, and steering it with strong engineering judgment.',
        ],
      },
      {
        heading: 'Code review becomes even more important',
        paragraphs: [
          'Because AI can produce plausible but incorrect code, teams need sharper review habits. Understanding architecture, edge cases, security, and maintainability matters more now, not less.',
          'The best developers are becoming faster editors and better decision-makers rather than just faster typists.',
        ],
      },
      {
        heading: 'Learning is becoming more interactive',
        paragraphs: [
          'New developers can ask questions in real time, compare approaches, and break down difficult concepts more quickly than before. That shortens learning cycles dramatically when used with discipline.',
          'The real differentiator will be the ability to ask better questions, verify results, and connect generated code to product goals.',
        ],
      },
    ],
  },
  {
    title: 'Getting Started with Full Stack Dev',
    cat: 'Learning Guides',
    date: 'Mar 5, 2025',
    excerpt: 'A clear roadmap from beginner to job-ready full stack developer.',
    intro:
      'Full stack development can feel overwhelming because it includes interface design, backend logic, databases, deployment, and collaboration. The key is learning in the right order.',
    sections: [
      {
        heading: 'Build strong frontend basics first',
        paragraphs: [
          'Start with HTML, CSS, and JavaScript fundamentals before jumping into frameworks. Learn how layouts work, how browser rendering behaves, and how data flows through an interface.',
          'Once those basics are clear, React or another frontend framework becomes easier to understand because you are building on concepts instead of memorizing patterns.',
        ],
      },
      {
        heading: 'Add backend and database thinking',
        paragraphs: [
          'Next, learn how APIs work, how servers handle requests, and how data is stored and queried. You do not need advanced system design on day one, but you should understand CRUD flows, authentication basics, and how the frontend talks to the backend.',
          'This is where projects become important. Even a small app with login, forms, and database storage can teach more than many isolated tutorials.',
        ],
      },
      {
        heading: 'Practice delivery, not just coding',
        paragraphs: [
          'Use Git, deploy your projects, fix bugs, and improve your code after feedback. Recruiters want people who can move a feature from idea to working output.',
          'A job-ready full stack learner usually has a small but solid set of projects, clear communication, and the ability to explain technical tradeoffs simply.',
        ],
      },
    ],
  },
  {
    title: 'Top React Interview Questions',
    cat: 'Career Tips',
    date: 'Feb 28, 2025',
    excerpt: 'Common questions and how to answer them with confidence.',
    intro:
      'React interviews are rarely only about syntax. Most interviewers want to know whether you understand component thinking, state flow, performance basics, and practical tradeoffs.',
    sections: [
      {
        heading: 'Expect core concept questions',
        paragraphs: [
          'Be ready to explain state vs props, controlled vs uncontrolled inputs, lifting state up, conditional rendering, and how component re-rendering works.',
          'A confident answer is usually simple, example-driven, and tied to something you have built rather than defined like a textbook.',
        ],
      },
      {
        heading: 'Prepare for practical coding discussions',
        paragraphs: [
          'Interviewers often ask how you would build a form, fetch data, handle loading and error states, or structure reusable components. These questions test whether you can think through real UI behavior.',
          'Projects are your best preparation here. If you have actually built dashboards, forms, lists, filters, or authentication flows, you will have stronger and more natural answers.',
        ],
      },
      {
        heading: 'Talk about decisions, not only APIs',
        paragraphs: [
          'Strong candidates can explain why they broke a UI into components, when they lifted state, when they reused a hook, or how they handled a slow API.',
          'That decision-making layer is what often separates a learner who has followed tutorials from a developer who can contribute on a team.',
        ],
      },
    ],
  },
  {
    title: 'Why Data Science Is Booming',
    cat: 'Industry Trends',
    date: 'Feb 20, 2025',
    excerpt: 'The skills and roles driving explosive growth in data careers.',
    intro:
      'Data science continues to grow because companies want better decisions, sharper predictions, and clearer visibility into what drives business outcomes.',
    sections: [
      {
        heading: 'Businesses want decision-ready insights',
        paragraphs: [
          'Organizations collect huge amounts of data but still struggle to turn that information into action. Data science helps bridge that gap through analysis, forecasting, experimentation, and intelligent automation.',
          'That is why demand is not limited to large tech firms. Finance, healthcare, retail, education, logistics, and consulting all rely on data-driven thinking now.',
        ],
      },
      {
        heading: 'The field includes many paths',
        paragraphs: [
          'Not every data role is advanced machine learning. Many teams need analysts, BI specialists, data engineers, reporting professionals, and junior data scientists who can clean data, communicate trends, and support decision-making.',
          'This creates multiple entry points for learners coming from Excel, SQL, Python, business, or engineering backgrounds.',
        ],
      },
      {
        heading: 'Communication is becoming a core skill',
        paragraphs: [
          'The strongest data professionals do more than build models. They explain what the numbers mean, what actions should be taken, and what limitations exist in the data.',
          'That combination of technical analysis and business storytelling is one reason the field remains attractive and fast-growing.',
        ],
      },
    ],
  },
  {
    title: 'Python vs JavaScript: Which First?',
    cat: 'Learning Guides',
    date: 'Feb 15, 2025',
    excerpt: 'A practical comparison for beginners choosing their first language.',
    intro:
      'Choosing your first programming language matters less than choosing one you can practice consistently through projects. Still, Python and JavaScript lead to slightly different starting experiences.',
    sections: [
      {
        heading: 'Why many beginners choose Python',
        paragraphs: [
          'Python reads cleanly and is often easier for beginners to understand. It is a popular starting point for automation, backend development, scripting, data analysis, and machine learning.',
          'If you are more interested in problem solving, data, or general programming foundations, Python can be a comfortable first language.',
        ],
      },
      {
        heading: 'Why JavaScript is powerful early on',
        paragraphs: [
          'JavaScript gives you immediate visual feedback in the browser, which makes learning interactive and motivating. It is also essential for frontend development and widely used across full stack web applications.',
          'If you want to build websites, interfaces, or client-facing products quickly, JavaScript is often the more practical first step.',
        ],
      },
      {
        heading: 'Pick based on the kind of projects you want',
        paragraphs: [
          'If your goal is web development, start with JavaScript. If your goal is data, scripting, or a softer introduction to programming, Python is a strong choice.',
          'In the long run, most serious developers learn both. What matters first is building momentum, completing projects, and understanding programming logic deeply.',
        ],
      },
    ],
  },
];

function categoryClass(category: string) {
  return colors.find((item) => item.label === category)?.color ?? '';
}

export default function BlogPage() {
  const [selected, setSelected] = useState<(typeof posts)[number] | null>(null);

  if (selected) {
    return (
      <main className="pt-nav">
        <section className="section-padding page-hero-section page-hero-blog article-page-section">
          <div className="container-custom article-wrap">
            <button type="button" onClick={() => setSelected(null)} className="article-back-link">
              <span className="article-back-icon-wrap">
                <ArrowLeft className="inline-link-icon" />
              </span>
              <span>Back to all articles</span>
            </button>
            <Reveal className="article-shell">
              <div className="article-header">
                <span className={`post-tag ${categoryClass(selected.cat)}`}>{selected.cat}</span>
                <h1 className="article-title">{selected.title}</h1>
                <p className="article-meta">{selected.date} · DigitBuild Team</p>
                <p className="article-intro">{selected.intro}</p>
              </div>

              <div className="article-body">
                {selected.sections.map((section) => (
                  <section key={section.heading} className="article-section">
                    <h2 className="article-section-title">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
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
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Blog</SectionEyebrow>
            <SectionTitle as="h1" className="mb-3">Insights &amp; guides</SectionTitle>
            <p className="page-hero-copy">Tips on careers, tech, and learning.</p>
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
