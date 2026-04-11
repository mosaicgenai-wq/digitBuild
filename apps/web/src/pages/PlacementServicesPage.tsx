import { ArrowRight, Briefcase, FileText, Globe, Linkedin, MessageSquare, Settings } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const offerings = [
  { icon: FileText, title: 'ATS Resume Writing', desc: 'Resumes built to pass automated screening systems.' },
  { icon: Globe, title: 'Naukri Optimization', desc: "Stand out on India's largest job portal." },
  { icon: Linkedin, title: 'LinkedIn Optimization', desc: 'A profile that attracts recruiters.' },
  { icon: Briefcase, title: 'Remote Job Help', desc: 'Find and land remote roles worldwide.' },
  { icon: Settings, title: 'Role-Based Profiles', desc: 'Tailored for your target industry and role.' },
  { icon: MessageSquare, title: '1-on-1 Consultation', desc: 'Personalized guidance from career experts.' },
];

const process = ['Info Collection', 'Resume Draft', 'Review', 'Optimization', 'Delivery'];

export default function PlacementServicesPage() {
  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-placement">
        <div className="container-custom narrow-center">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Placement Support</SectionEyebrow>
            <h1 className="page-hero-title">
              <span>Get hired faster</span>
              <br />
              <span className="page-hero-muted">with optimized profiles</span>
            </h1>
            <p className="page-hero-copy">
              We make sure your resume and profiles pass automated filters and reach real humans.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom split-section">
          <Reveal>
            <div className="icon-stage">
              <FileText className="icon-stage-icon" strokeWidth={1} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionEyebrow>What is ATS?</SectionEyebrow>
            <SectionTitle className="mb-3">Why your resume gets rejected</SectionTitle>
            <p className="body-copy">
              90% of companies use Applicant Tracking Systems to filter resumes before a human ever sees them. Without proper formatting and keywords, qualified candidates get auto-rejected. We fix that.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>What We Offer</SectionEyebrow>
            <SectionTitle className="mb-12">Complete career support</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {offerings.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="info-card">
                  <div className="card-header-inline card-header-inline-center">
                    <item.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="card-copy-center">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Process</SectionEyebrow>
            <SectionTitle className="mb-12 center-text">How it works</SectionTitle>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="process-flow">
              {process.map((step, index) => (
                <div key={step} className="process-step-wrap">
                  <div className="process-step">
                    <div className="process-index">{index + 1}</div>
                    <span>{step}</span>
                  </div>
                  {index < process.length - 1 ? <div className="process-line desktop-only-block" /> : null}
                </div>
              ))}
            </div>
            <div className="center-text mt-6">
              <span className="time-chip">⏱ 4–6 working days</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <div className="container-custom center-text">
          <Reveal>
            <SectionTitle className="mb-3">Ready to get more interviews?</SectionTitle>
            <ButtonLink to="/contact">
              Get Started <ArrowRight className="btn-icon" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
