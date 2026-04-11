import { ArrowRight, Globe, ShieldCheck, Smartphone } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const items = [
  { icon: Globe, title: 'Web Development', desc: 'Modern web apps built for scale. From MVPs to enterprise platforms.' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Cross-platform iOS and Android apps designed for performance.' },
  { icon: Smartphone, title: 'AI & Automation', desc: 'Smart solutions with ML, NLP, and process automation.' },
  { icon: ShieldCheck, title: 'Cyber Security', desc: 'Security audits, pen testing, and compliance solutions.' },
];

export default function TechnologyServicesPage() {
  return (
    <main className="pt-nav">
      <section className="section-padding page-hero-section page-hero-technology">
        <div className="container-custom narrow-center">
          <Reveal className="page-hero-intro">
            <SectionEyebrow>Technology</SectionEyebrow>
            <h1 className="page-hero-title">
              <span>Solutions</span> <span className="page-hero-muted">built to scale</span>
            </h1>
            <p className="page-hero-copy">End-to-end tech services for startups and growing businesses.</p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Capabilities</SectionEyebrow>
            <SectionTitle className="mb-12">Technology services we deliver</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-2">
            {items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="info-card large-card">
                  <div className="card-header-inline card-header-inline-center">
                    <item.icon className="large-card-icon" strokeWidth={1.2} />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="card-copy-center">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container-custom center-text">
          <Reveal>
            <SectionTitle className="mb-3">Have a project in mind?</SectionTitle>
            <ButtonLink to="/contact">
              Let's Talk <ArrowRight className="btn-icon" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
