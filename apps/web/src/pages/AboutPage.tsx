import { Briefcase, GraduationCap, Sparkles, Target, Users } from 'lucide-react';
import { Counter } from '../components/ui/Counter';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow } from '../components/ui/SectionIntro';

const sections = [
  {
    title: 'Who We Are',
    desc: "We're a Pune-based team of engineers and educators with 7+ years of industry experience. We've helped 500+ students transition into successful tech careers through practical, hands-on training.",
    visualClassName: 'about-visual-team',
    visualTitle: 'Mentors + builders',
    visualStats: ['Live project guidance', 'Career-first learning', 'Hands-on support'],
    visualIcon: Users,
  },
  {
    title: 'Our Goal',
    desc: "Make every student job-ready from day one. We don't count enrollments — we count placements. Every decision we make is centered on your career outcome.",
    visualClassName: 'about-visual-goal',
    visualTitle: 'Placement outcomes',
    visualStats: ['Resume to interview strategy', 'Portfolio positioning', 'Recruiter-ready profiles'],
    visualIcon: Target,
  },
  {
    title: 'Our Mission',
    desc: "Quality tech education shouldn't be exclusive. We make it practical, affordable, and outcome-driven — with support from enrollment through your first job.",
    visualClassName: 'about-visual-mission',
    visualTitle: 'From skill to salary',
    visualStats: ['Structured learning paths', 'Mentorship checkpoints', 'Support beyond the classroom'],
    visualIcon: Sparkles,
  },
];

const stats = [
  { value: 7, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Careers Launched' },
];

export default function AboutPage() {
  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-about">
        <div className="container-custom narrow-center">
          <Reveal>
            <SectionEyebrow>About Us</SectionEyebrow>
            <h1 className="page-hero-title">
              Education that <span className="page-hero-muted">leads to careers</span>
            </h1>
            <p className="page-hero-copy">Not just learning — landing.</p>
          </Reveal>
        </div>
      </section>

      {sections.map((section, index) => (
        <section key={section.title} className={`section-padding ${index % 2 === 0 ? 'surface-section' : ''}`}>
          <div className="container-custom split-section">
            <Reveal className={index % 2 !== 0 ? 'order-mobile-last' : ''}>
              <div className={`icon-stage about-visual ${section.visualClassName}`}>
                <div className="about-visual-orb about-visual-orb-one" />
                <div className="about-visual-orb about-visual-orb-two" />
                <div className="about-visual-card">
                  <div className="about-visual-card-top">
                    <section.visualIcon className="about-visual-icon" strokeWidth={1.5} />
                    <span className="about-visual-pill">DigitBuild</span>
                  </div>
                  <h3 className="about-visual-title">{section.visualTitle}</h3>
                  <div className="about-visual-list">
                    {section.visualStats.map((item, itemIndex) => (
                      <div key={item} className="about-visual-item">
                        <span className="about-visual-index">0{itemIndex + 1}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="about-visual-footer">
                    <div className="about-visual-badge">
                      <GraduationCap className="about-visual-badge-icon" />
                      Learner growth
                    </div>
                    <div className="about-visual-badge">
                      <Briefcase className="about-visual-badge-icon" />
                      Placement focus
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className={index % 2 !== 0 ? 'order-mobile-first' : ''}>
              <SectionEyebrow>{section.title}</SectionEyebrow>
              <h2 className="subsection-title">{section.title}</h2>
              <p className="body-copy">{section.desc}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="stats-band">
        <div className="container-custom">
          <div className="stats-grid three-col">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p>{stat.label}</p>
              </div>
            ))}
            <div className="stat-card">
              <span className="counter">Pune</span>
              <p>India</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
