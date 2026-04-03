import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Send } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const openings = [
  {
    title: 'Frontend Developer Intern',
    type: 'Internship',
    location: 'Pune / Hybrid',
    mode: 'Full-time',
    summary: 'Work on modern React interfaces, component systems, and landing pages for live client and internal products.',
  },
  {
    title: 'Full Stack Developer Trainee',
    type: 'Trainee',
    location: 'Pune',
    mode: 'Full-time',
    summary: 'Learn and contribute across frontend, backend, APIs, and deployment workflows with mentor guidance.',
  },
  {
    title: 'Business Development Associate',
    type: 'Entry Level',
    location: 'Pune / On-site',
    mode: 'Full-time',
    summary: 'Help grow enrollments, partnerships, and client conversations with a practical sales and relationship focus.',
  },
];

const process = ['Apply with resume', 'Shortlisting', 'Discussion round', 'Task or assessment', 'Final decision'];

export default function CareerPage() {
  return (
    <main className="pt-nav">
      <section className="section-padding">
        <div className="container-custom narrow-center">
          <Reveal>
            <SectionEyebrow>Career</SectionEyebrow>
            <h1 className="page-hero-title">
              Join us in building <span className="page-hero-muted">real opportunities</span>
            </h1>
            <p className="page-hero-copy">
              We will be releasing career opportunities here for internships, trainee roles, and growth-focused positions as the team expands.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Open Roles</SectionEyebrow>
            <SectionTitle className="mb-12">Current and upcoming openings</SectionTitle>
          </Reveal>

          <div className="career-grid">
            {openings.map((opening, index) => (
              <Reveal key={opening.title} delay={index * 0.06}>
                <div className="career-card">
                  <div className="career-card-top">
                    <span className="duration-chip">{opening.type}</span>
                    <BriefcaseBusiness className="info-icon career-icon" strokeWidth={1.8} />
                  </div>
                  <h3>{opening.title}</h3>
                  <p className="career-summary">{opening.summary}</p>
                  <div className="career-meta">
                    <span><MapPin className="career-meta-icon" />{opening.location}</span>
                    <span><Clock3 className="career-meta-icon" />{opening.mode}</span>
                  </div>
                  <div className="career-actions">
                    <a
                      href={`mailto:hello@digitbuild.com?subject=${encodeURIComponent(`Application for ${opening.title}`)}`}
                      className="inline-link"
                    >
                      Apply now <Send className="inline-link-icon" />
                    </a>
                    <ButtonLink to="/contact" variant="pill-outline" size="sm">
                      Ask about role
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Hiring Flow</SectionEyebrow>
            <SectionTitle className="mb-12">Simple and transparent process</SectionTitle>
          </Reveal>

          <div className="career-process">
            {process.map((step, index) => (
              <Reveal key={step} delay={index * 0.05}>
                <div className="career-process-step">
                  <span className="support-step-index">{index + 1}</span>
                  <span>{step}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container-custom center-text">
          <Reveal>
            <h2 className="cta-title">Want to be considered for future openings?</h2>
            <ButtonLink to="/contact">
              Connect with us <ArrowRight className="btn-icon" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
