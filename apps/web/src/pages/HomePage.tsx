import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Laptop,
  Linkedin,
  MessageSquare,
  Quote,
  Shield,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { Counter } from '../components/ui/Counter';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const stats = [
  { value: 3500, suffix: '+', label: 'Resumes Written' },
  { value: 1000, suffix: '+', label: 'LinkedIn Profiles Optimized' },
  { value: 70, suffix: '%+', label: 'Interview Conversion' },
  { value: 98, suffix: '%', label: 'Candidates Placed' },
  { value: 15, suffix: '+', label: 'Clients Served' },
];

const aboutCards = [
  {
    icon: Users,
    title: 'Who we are?',
    desc: 'We are tech educators and placement experts dedicated to turning learners into industry-ready professionals.',
  },
  {
    icon: Target,
    title: 'Our Goal',
    desc: 'To bridge the gap between education and employment by making quality tech training and job placement accessible to everyone.',
  },
  {
    icon: Sparkles,
    title: 'Our Mission',
    desc: 'To be the career partner we wish we had - guiding every learner from first skill to first salary.',
  },
];

const services = [
  {
    icon: GraduationCap,
    title: 'Industry-Aligned Courses',
    desc: 'Structured programs built around practical curriculum, live projects, and job-ready timelines.',
    to: '/courses',
  },
  {
    icon: Briefcase,
    title: 'Placement Support',
    desc: 'Resume, LinkedIn, job-application strategy, interview preparation, and profile positioning support.',
    to: '/#career-support',
  },
  {
    icon: Laptop,
    title: 'Software Solutions',
    desc: 'Real-world web, mobile, and digital product services delivered by an execution-focused tech team.',
    to: '/technology-services',
  },
];

const careerOfferings = [
  {
    icon: FileText,
    title: 'ATS Resume Writing',
    desc: 'Rank Higher on Naukri. Get More Recruiter Calls. Land Your Dream Job Faster.',
  },
  {
    icon: Globe,
    title: 'Naukri Profile Optimization',
    desc: 'Boost visibility with keyword-rich positioning that helps your profile surface in more recruiter searches.',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Optimization',
    desc: "Get Discovered. Build Authority. Attract Recruiters - on the world's #1 professional network.",
  },
  {
    icon: Briefcase,
    title: 'Remote Job Placement Support',
    desc: 'Your dream remote job is out there - we help you find it, apply for it, and land it.',
  },
  {
    icon: Users,
    title: 'Career Switching Guidance',
    desc: 'Ready for a career change? We map your path, build your profile, and help you switch industries confidently.',
  },
  {
    icon: GraduationCap,
    title: 'Fresher Launch Package',
    desc: "Just graduated? Don't just apply - launch your career the right way and get noticed by top recruiters from day one.",
  },
  {
    icon: Globe,
    title: 'International Resume Writing',
    desc: 'Go global with a world-class resume crafted to match international standards and hiring expectations abroad.',
  },
  {
    icon: FileCheck,
    title: 'Tailored Resume Writing',
    desc: 'Personalized. Targeted. Powerful - a resume written specifically for you, your role, and your industry.',
  },
  {
    icon: BookOpen,
    title: 'Internship and Training',
    desc: 'Launch your internship journey right with a professionally crafted resume and profile that gets you selected for the best training opportunities.',
  },
];

const reasons = [
  {
    icon: BookOpen,
    title: 'Expert-Built Curriculum',
    desc: "Courses designed by industry professionals - not academics. Learn what's actually used in the real world.",
  },
  {
    icon: Users,
    title: 'Mentorship by Practitioners',
    desc: 'Get 1-on-1 guidance from mentors actively working in top companies - not just teaching from textbooks.',
  },
  {
    icon: Laptop,
    title: 'Live Project Experience',
    desc: 'Build portfolio-worthy products from day one. Hands-on projects that solve real problems - not dummy exercises.',
  },
  {
    icon: FileCheck,
    title: 'ATS-Optimised Resume',
    desc: 'Get a professionally crafted resume that clears automated screening systems and lands you more interviews.',
  },
  {
    icon: GraduationCap,
    title: 'Placement-First Approach',
    desc: 'A dedicated placement team works alongside you - from interview prep to offer negotiation - until you land the job.',
  },
  {
    icon: Shield,
    title: 'End-to-End Support',
    desc: "From the moment you enrol to your first job offer - we're with you every step with full career and technical support.",
  },
];

const testimonials = [
  {
    name: 'Aarav Mehta',
    role: 'Frontend Developer',
    company: 'TCS',
    hike: '65%',
    quote: 'The mentors corrected my resume, my interview answers, and even my confidence level. I got calls within days.',
  },
  {
    name: 'Neha Kulkarni',
    role: 'QA Engineer',
    company: 'Infosys',
    hike: '48%',
    quote: 'DigitBuild made the process simple. My LinkedIn, Naukri profile, and interview prep all worked together.',
  },
  {
    name: 'Rohit Sharma',
    role: 'Data Analyst',
    company: 'Wipro',
    hike: '54%',
    quote: 'I came in as a fresher and left with a complete launch plan. The support felt personal and practical.',
  },
  {
    name: 'Sneha Patil',
    role: 'Full Stack Developer',
    company: 'Accenture',
    hike: '72%',
    quote: 'The projects helped me speak with confidence, and the placement team helped me convert interviews into an offer.',
  },
  {
    name: 'Vikram Joshi',
    role: 'Software Engineer',
    company: 'Capgemini',
    hike: '58%',
    quote: 'Their placement-first approach is real. They stayed with me until I accepted the offer.',
  },
];

const placedCompanies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant', 'Tech Mahindra', 'Persistent'];
const whatsappNumber = '+917385490573';

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

  const getVisualSlot = (index: number) => {
    if (!isTestimonialAnimating) {
      return ['far-prev', 'prev', 'active', 'next', 'far-next'][index];
    }

    if (testimonialDirection === 1) {
      return ['far-prev', 'prev', 'next', 'active', 'far-next'][index];
    }

    if (testimonialDirection === -1) {
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

  const careerSupportWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi DigitBuild, I want to know more about your placement support services.',
  )}`;

  return (
    <main>
      <section className="hero-section">
        <div className="container-custom hero-grid">
          <div>
            <Reveal>
              <h1 className="hero-title">
                <span className="hero-title-muted">Learn Skills.</span>
                <br />
                <span>
                  Build Products. Get Placed<span className="text-primary">.</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="hero-copy">
                Industry-aligned courses, guaranteed placement support, and real-world software solutions - all under one roof.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="hero-actions">
                <ButtonLink to="/courses">Browse Courses</ButtonLink>
                <ButtonLink to="/#career-support" variant="pill-outline">
                  Job Placement Support
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
                    skills: <span className="code-accent">"industry-ready"</span>,
                  </p>
                  <p className="code-indent">
                    products: <span className="code-accent">"shipping"</span>,
                  </p>
                  <p className="code-indent">
                    placed: <span className="code-accent">true</span>,
                  </p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </Reveal>
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

      <section id="services" className="section-padding surface-section section-anchor">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Services</SectionEyebrow>
            <SectionTitle className="mb-12">Everything you need under one roof</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.06}>
                <Link to={service.to} className="service-card-link">
                  <div className="info-card">
                    <service.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="career-support" className="section-padding section-anchor">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Placement Support</SectionEyebrow>
            <SectionTitle className="mb-3">Placement support that goes beyond advice</SectionTitle>
            <p className="page-hero-copy left-copy">
              We create ATS-friendly resumes designed to pass applicant tracking systems and reach hiring managers, helping you stand out in today&apos;s competitive job market. Our experts also optimize your Naukri, LinkedIn, and other profiles with the right keywords and positioning to boost visibility, increase calls, and secure more interview opportunities faster.
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
            <div className="support-strip-action support-strip-action-spaced">
              <a href={careerSupportWhatsappLink} target="_blank" rel="noreferrer" className="whatsapp-inline-link">
                <span>WhatsApp</span>
                <MessageSquare className="inline-link-icon" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stats-band">
        <div className="container-custom">
          <div className="stats-grid stats-grid-5">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding surface-section overflow-hidden">
        <div className="container-custom mb-12">
          <Reveal>
            <SectionEyebrow>Testimonials</SectionEyebrow>
            <SectionTitle>What our learners say</SectionTitle>
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
              onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget) return;
                finishTestimonialAnimation();
              }}
            >
              {renderedTestimonials.map((testimonial, index) => (
                <div key={testimonial.name + testimonial.company} className={`testimonial-card testimonial-card-${getVisualSlot(index)}`}>
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
                    <span className="hike-badge">{testimonial.hike} hike</span>
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

      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Placed At</SectionEyebrow>
            <SectionTitle className="mb-12">Companies where candidates got placed</SectionTitle>
          </Reveal>
          <div className="company-marquee">
            {placedCompanies.map((company, index) => (
              <Reveal key={company} delay={index * 0.05}>
                <div className="company-pill">{company}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Why DigitBuild</SectionEyebrow>
            <SectionTitle className="mb-12">Why learners choose DigitBuild</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {reasons.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="info-card">
                  <item.icon className="info-icon" strokeWidth={1.5} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}



