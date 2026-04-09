import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Send, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const openings = [
  {
    title: 'Frontend Developer Intern',
    type: 'Internship',
    location: 'Pune / Hybrid',
    mode: 'Full-time',
    team: 'Product Design and Frontend',
    summary: 'Work on modern React interfaces, component systems, and landing pages for live client and internal products.',
    overview:
      'You will support our frontend team in designing polished user journeys, improving component quality, and shipping responsive experiences that feel fast, clean, and trustworthy.',
    responsibilities: [
      'Build responsive React and TypeScript UI sections from Figma-style direction and product briefs.',
      'Improve reusable components, landing pages, and motion details across the marketing and product experience.',
      'Work closely with mentors to debug UI issues, tighten accessibility, and maintain visual consistency.',
    ],
    requirements: [
      'Comfort with HTML, CSS, JavaScript, and React fundamentals.',
      'A sharp eye for spacing, typography, and responsive layouts.',
      'Willingness to learn quickly, take feedback well, and iterate with the team.',
    ],
    perks: ['Mentored learning plan', 'Portfolio-worthy live work', 'Opportunity to convert into a trainee role'],
    applyNote: 'Best fit for candidates who enjoy UI craft, frontend polish, and building clean digital experiences.',
  },
  {
    title: 'Full Stack Developer Trainee',
    type: 'Trainee',
    location: 'Pune',
    mode: 'Full-time',
    team: 'Engineering',
    summary: 'Learn and contribute across frontend, backend, APIs, and deployment workflows with mentor guidance.',
    overview:
      'This role is built for candidates who want structured exposure to real development work. You will move beyond tutorials and contribute to production-style features across the stack.',
    responsibilities: [
      'Assist in building frontend screens, backend APIs, and database-connected features.',
      'Participate in bug fixing, code reviews, and deployment-oriented engineering workflows.',
      'Collaborate with mentors on debugging, project architecture, and practical development standards.',
    ],
    requirements: [
      'Basic knowledge of JavaScript and at least one frontend or backend framework.',
      'Understanding of APIs, Git, and programming fundamentals.',
      'Strong ownership mindset and interest in growing into a full stack product engineer.',
    ],
    perks: ['Cross-functional project exposure', 'Hands-on mentor reviews', 'Placement-focused growth roadmap'],
    applyNote: 'A strong option for learners ready to become execution-focused developers with real delivery discipline.',
  },
  {
    title: 'Business Development Associate',
    type: 'Entry Level',
    location: 'Pune / On-site',
    mode: 'Full-time',
    team: 'Growth and Partnerships',
    summary: 'Help grow enrollments, partnerships, and client conversations with a practical sales and relationship focus.',
    overview:
      'You will help DigitBuild grow by building trust with prospects, explaining our offerings clearly, and supporting the pipeline from first conversation to conversion.',
    responsibilities: [
      'Handle inbound leads, explain programs clearly, and maintain timely follow-ups.',
      'Support outreach for partnerships, collaborations, and service conversations.',
      'Track conversations, share customer insights, and help improve the sales process.',
    ],
    requirements: [
      'Strong communication and relationship-building skills.',
      'Comfort speaking with students, working professionals, and business leads.',
      'Organized follow-through and confidence in a target-oriented environment.',
    ],
    perks: ['Direct revenue exposure', 'Sales and communication mentoring', 'Growth path into partnerships and account management'],
    applyNote: 'Great for candidates who enjoy people-facing work and want to grow in business, sales, and partnerships.',
  },
];

const process = ['Apply with resume', 'Shortlisting', 'Discussion round', 'Task or assessment', 'Final decision'];

export default function CareerPage() {
  const [selectedOpening, setSelectedOpening] = useState<(typeof openings)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedOpening) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [selectedOpening]);

  function openOpeningDetails(opening: (typeof openings)[number]) {
    setSelectedOpening(opening);
  }

  function closeOpeningDetails() {
    setSelectedOpening(null);
  }

  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-career">
        <div className="container-custom narrow-center">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Career</SectionEyebrow>
            <h1 className="page-hero-title">
              Join us in building <span className="page-hero-muted">real opportunities</span>
            </h1>
            <p className="page-hero-copy">
              Explore internships, trainee roles, and growth-focused openings. Click any card to view the full job description before you apply.
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
                <div
                  className="career-card career-card-button"
                  role="button"
                  tabIndex={0}
                  onClick={() => openOpeningDetails(opening)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openOpeningDetails(opening);
                    }
                  }}
                >
                  <div className="career-card-top">
                    <span className="duration-chip">{opening.type}</span>
                    <BriefcaseBusiness className="info-icon career-icon" strokeWidth={1.8} />
                  </div>
                  <h3>{opening.title}</h3>
                  <p className="career-summary">{opening.summary}</p>
                  <div className="career-meta">
                    <span><MapPin className="career-meta-icon" />{opening.location}</span>
                    <span><Clock3 className="career-meta-icon" />{opening.mode}</span>
                    <span><Users className="career-meta-icon" />{opening.team}</span>
                  </div>
                  <div className="career-actions">
                    <span className="career-cta-text">
                      View job description <ArrowRight className="inline-link-icon" />
                    </span>
                    <ButtonLink
                      to="/contact"
                      variant="pill-outline"
                      size="sm"
                      onClick={(event) => event.stopPropagation()}
                    >
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

      <dialog
        ref={dialogRef}
        className="course-modal"
        onClose={closeOpeningDetails}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeOpeningDetails();
          }
        }}
      >
        {selectedOpening ? (
          <div className="course-modal-panel" aria-labelledby="career-modal-title" aria-describedby="career-modal-desc">
            <div className="course-modal-header">
              <div>
                <span className="course-modal-kicker">{selectedOpening.type}</span>
                <h2 id="career-modal-title" className="course-modal-title">
                  {selectedOpening.title}
                </h2>
                <p id="career-modal-desc" className="course-modal-copy">
                  {selectedOpening.overview}
                </p>
              </div>
              <button type="button" className="course-modal-close" onClick={closeOpeningDetails} aria-label="Close job description" autoFocus>
                <X />
              </button>
            </div>

            <div className="course-modal-highlights">
              <span className="course-modal-highlight"><MapPin className="feature-check" />{selectedOpening.location}</span>
              <span className="course-modal-highlight"><Clock3 className="feature-check" />{selectedOpening.mode}</span>
              <span className="course-modal-highlight"><Users className="feature-check" />{selectedOpening.team}</span>
            </div>

            <div className="career-modal-grid">
              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">Key Responsibilities</p>
                  <ul className="career-modal-list">
                    {selectedOpening.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="course-detail-panel course-detail-panel-modal">
                <div className="course-detail-block">
                  <p className="course-detail-label">What We Are Looking For</p>
                  <ul className="career-modal-list">
                    {selectedOpening.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="course-detail-panel course-detail-panel-modal">
              <div className="course-detail-block">
                <p className="course-detail-label">Why This Role Can Be Exciting</p>
                <ul className="career-modal-list">
                  {selectedOpening.perks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="career-modal-note">{selectedOpening.applyNote}</div>

            <div className="course-detail-actions course-detail-actions-modal">
              <a href={`mailto:hello@digitbuild.com?subject=${encodeURIComponent(`Application for ${selectedOpening.title}`)}`} className="btn btn-pill btn-sm">
                Apply now <Send className="btn-icon" />
              </a>
              <ButtonLink to="/contact" variant="pill-outline" size="sm">
                Ask about role
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </dialog>
    </main>
  );
}
