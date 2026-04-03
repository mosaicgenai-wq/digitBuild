import { BookOpen, Briefcase, ChevronLeft, ChevronRight, FileCheck, FileText, Globe, GraduationCap, Laptop, Linkedin, MessageSquare, Quote, Settings, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Counter } from '../components/ui/Counter';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { ButtonLink } from '../components/ui/Button';

const stats = [
  { value: 1000, suffix: '+', label: 'Students Trained' },
  { value: 8, suffix: '+', label: 'Courses Offered' },
  { value: 900, suffix: '+', label: 'Classes Delivered' },
  { value: 99, suffix: '%', label: 'Positive Learning Outcome' },
];

const aboutCards = [
  { icon: Users, title: 'Who We Are', desc: 'Educators and engineers from Pune with 7+ years of real-world experience.' },
  { icon: Users, title: 'Our Goal', desc: 'Get you job-ready. We measure success by placements, not enrollments.' },
  { icon: Users, title: 'Our Mission', desc: 'Make quality tech education practical, accessible, and outcome-driven.' },
];

const services = [
  { icon: GraduationCap, title: 'Career Support', desc: 'Resume, profile, interview, and hiring guidance', to: '#career-support' },
  { icon: GraduationCap, title: 'Courses', desc: '8 industry-aligned programs', to: '/courses' },
  { icon: Laptop, title: 'Tech Solutions', desc: 'Web, mobile, AI development', to: '/technology-services' },
];

const careerOfferings = [
  { icon: FileText, title: 'ATS Resume Writing', desc: 'Resumes structured to pass screening tools and get shortlisted faster.' },
  { icon: Globe, title: 'Naukri Optimization', desc: "Sharper positioning for India's largest job marketplace." },
  { icon: Linkedin, title: 'LinkedIn Optimization', desc: 'Profiles designed to attract recruiters and hiring managers.' },
  { icon: Briefcase, title: 'Remote Job Help', desc: 'Guidance for international, hybrid, and remote-friendly roles.' },
  { icon: Settings, title: 'Role-Based Profiles', desc: 'Tailored messaging for the exact role you are targeting.' },
  { icon: MessageSquare, title: '1-on-1 Consultation', desc: 'Personalized feedback on your readiness, positioning, and next steps.' },
];

const supportProcess = [
  'Profile Audit',
  'Resume & LinkedIn Revamp',
  'Interview Prep',
  'Application Strategy',
  'Ongoing Support',
];

const reasons = [
  { icon: BookOpen, title: 'Real Curriculum', desc: 'Built by working engineers, not textbook authors.' },
  { icon: Users, title: 'Active Mentors', desc: 'Learn from people currently in the industry.' },
  { icon: GraduationCap, title: 'Placement First', desc: 'Dedicated team focused on your career.' },
  { icon: Laptop, title: 'Live Projects', desc: 'Build real products, not dummy exercises.' },
  { icon: FileCheck, title: 'ATS-Ready Profiles', desc: 'Resumes that pass automated screening.' },
  { icon: Shield, title: 'Full Support', desc: 'From enrollment to your first job offer.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Frontend Dev', company: 'TCS', hike: '60%', quote: 'The mentorship was world-class. I felt genuinely prepared.' },
  { name: 'Rahul P.', role: 'Full Stack Dev', company: 'Infosys', hike: '45%', quote: 'Got placed within 3 weeks of completing. Incredible support.' },
  { name: 'Sneha K.', role: 'Data Analyst', company: 'Wipro', hike: '55%', quote: 'All practical, no fluff. Exactly what the industry needs.' },
  { name: 'Amit D.', role: 'SDE', company: 'Accenture', hike: '70%', quote: 'From zero coding to a top MNC — DigitBuild made it real.' },
  { name: 'Kavita J.', role: 'QA Engineer', company: 'Persistent', hike: '50%', quote: 'Mock interviews were invaluable. I walked in confident.' },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState<-1 | 0 | 1>(0);
  const [isTestimonialAnimating, setIsTestimonialAnimating] = useState(false);
  const [isTestimonialResetting, setIsTestimonialResetting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!isTestimonialAnimating) {
        handleTestimonialChange(1);
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isTestimonialAnimating]);

  const handleTestimonialChange = (direction: -1 | 1) => {
    if (isTestimonialAnimating) return;

    setTestimonialDirection(direction);
    setIsTestimonialAnimating(true);
  };

  const renderedTestimonials = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (activeIndex + offset + testimonials.length) % testimonials.length;

    return {
      ...testimonials[index],
      carouselIndex: index,
      offset,
    };
  });

  // const getVisualSlot = (index: number): 'far-prev' | 'prev' | 'active' | 'next' | 'far-next' => {
  //   return ['far-prev', 'prev', 'active', 'next', 'far-next'][index] as 'far-prev' | 'prev' | 'active' | 'next' | 'far-next';
  // };

  const getVisualSlot = (index: number) => {
    if (!isTestimonialAnimating) {
      return ['far-prev', 'prev', 'active', 'next', 'far-next'][index];
    }

    if (testimonialDirection === 1) {
      // shifting left → next becomes active DURING animation
      return ['far-prev', 'prev', 'next', 'active', 'far-next'][index];
    }

    if (testimonialDirection === -1) {
      // shifting right → prev becomes active DURING animation
      return ['far-prev', 'active', 'prev', 'next', 'far-next'][index];
    }

    return ['far-prev', 'prev', 'active', 'next', 'far-next'][index];
  };

  const finishTestimonialAnimation = () => {
    if (!isTestimonialAnimating || testimonialDirection === 0) return;

    setActiveIndex((current) => (current + testimonialDirection + testimonials.length) % testimonials.length);
    setIsTestimonialResetting(true);

    window.requestAnimationFrame(() => {
      setTestimonialDirection(0);
      setIsTestimonialAnimating(false);
      setIsTestimonialResetting(false);
    });
  };

  const getTestimonialTransform = () => {
    if (isTestimonialResetting || testimonialDirection === 0) {
      return 'translateX(var(--testimonial-base-offset))';
    }

    if (testimonialDirection === 1) {
      return 'translateX(calc(var(--testimonial-base-offset) - var(--testimonial-step)))';
    }

    if (testimonialDirection === -1) {
      return 'translateX(calc(var(--testimonial-base-offset) + var(--testimonial-step)))';
    }

    return 'translateX(var(--testimonial-base-offset))';
  };

  return (
    <main>
      <section className="hero-section">
        <div className="container-custom hero-grid">
          <div>
            <Reveal>
              <h1 className="hero-title">
                <span className="hero-title-muted">Learn skills.</span>
                <br />
                <span>
                  Land your dream job<span className="text-primary">.</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="hero-copy">
                Industry-aligned courses, hands-on mentorship, and dedicated placement support — all in one place.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="hero-actions">
                <ButtonLink to="/courses">Browse Courses</ButtonLink>
                <ButtonLink to="#career-support" variant="pill-outline">
                  Career Support
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="hero-visual-wrap desktop-only-flex">
            <div className="hero-visual">
              <div className="hero-card hero-card-one" />
              <div className="hero-card hero-card-two" />
              <div className="hero-card hero-card-main">
                <div className="code-window">
                  <div className="code-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <p>
                    <span className="code-keyword">const</span> you = {'{'}
                  </p>
                  <p className="code-indent">
                    skills: <span className="code-accent">"growing"</span>,
                  </p>
                  <p className="code-indent">
                    hired: <span className="code-accent">true</span>,
                  </p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stats-band">
        <div className="container-custom">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>About</SectionEyebrow>
            <SectionTitle className="mb-12">What makes us different</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {aboutCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <div className="info-card">
                  <card.icon className="info-icon" strokeWidth={1.5} />
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="career-support" className="section-padding surface-section">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Services</SectionEyebrow>
            <SectionTitle className="mb-3">Career Services & placement support</SectionTitle>
            <p className="page-hero-copy left-copy">
              We do not just teach. We help candidates become interview-ready with stronger resumes, better LinkedIn positioning, smarter application strategy, and practical hiring support.
            </p>
          </Reveal>

          <div className="card-grid card-grid-3">
            {careerOfferings.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="info-card">
                  <item.icon className="info-icon" strokeWidth={1.5} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18}>
            <div className="support-strip">
              <div>
                <h3 className="support-strip-title">How the service works</h3>
                <p className="support-strip-copy">
                  We start with your current profile, identify gaps, improve positioning, prepare you for interviews, and support your applications with a realistic action plan.
                </p>
              </div>
              <div className="support-steps-marquee">
                <div className="support-steps-track">
                  {[...supportProcess, ...supportProcess].map((step, index) => (
                    <div key={`${step}-${index}`} className="support-step">
                      <span className="support-step-index">{(index % supportProcess.length) + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Services</SectionEyebrow>
            <SectionTitle className="mb-12">Everything you need to succeed</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.06}>
                <a href={service.to} className="service-card-link">
                  <div className="info-card">
                    <service.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Why DigitBuild</SectionEyebrow>
            <SectionTitle className="mb-12">Built for outcomes</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {reasons.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="reason-item">
                  <div className="reason-icon-wrap">
                    <item.icon className="reason-icon" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding surface-section overflow-hidden">
        <div className="container-custom mb-12">
          <Reveal>
            <SectionEyebrow>Testimonials</SectionEyebrow>
            <SectionTitle>What our students say</SectionTitle>
          </Reveal>
        </div>
        <div className="testimonial-carousel">
          <button
            type="button"
            className="testimonial-arrow"
            aria-label="Show previous testimonial"
            onClick={() => handleTestimonialChange(-1)}
          >
            <ChevronLeft />
          </button>
          <div className="testimonial-viewport" aria-live="polite">
            <div
              className={`testimonial-strip${isTestimonialAnimating && !isTestimonialResetting ? ' is-animating' : ''}${isTestimonialResetting ? ' is-resetting' : ''}`}
              style={{ transform: getTestimonialTransform() }}
              // onTransitionEnd={finishTestimonialAnimation}
              onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget) return;
                finishTestimonialAnimation();
              }}
            >
              {renderedTestimonials.map((testimonial, index) => (
                <div
                  // key={`${testimonial.name}-${testimonial.carouselIndex}-${testimonial.offset}`}
                  key={testimonial.name + testimonial.company}
                  className={`testimonial-card testimonial-card-${getVisualSlot(index)}`}
                >
                  <Quote className="testimonial-quote" />
                  <p className="testimonial-copy">"{testimonial.quote}"</p>
                  <div className="testimonial-meta">
                    <div className="testimonial-user">
                      <div className="avatar">{testimonial.name[0]}</div>
                      <div>
                        <p className="testimonial-name">{testimonial.name}</p>
                        <p className="testimonial-role">
                          {testimonial.role} · {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <span className="hike-badge">↑{testimonial.hike}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="testimonial-arrow"
            aria-label="Show next testimonial"
            onClick={() => handleTestimonialChange(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </main>
  );
}
