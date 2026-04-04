import { ArrowRight, Atom, ChartColumn, Check, Database, MessageCircle, Smartphone, Terminal, TestTube } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';

const categories = ['All', 'Development', 'Testing', 'Analytics'];
const whatsappNumber = '+917385490573';
const courses = [
  { title: 'Full Stack Development', icon: Terminal, cat: 'Development', duration: '6 Months', highlights: ['MERN Stack', 'APIs & Deployment', 'Real Projects'] },
  { title: 'React JS', icon: Atom, cat: 'Development', duration: '3 Months', highlights: ['Hooks & State', 'Next.js Basics', 'Portfolio Build'] },
  { title: 'Python', icon: Terminal, cat: 'Development', duration: '4 Months', highlights: ['Core Python', 'Django', 'Data Structures'] },
  { title: 'Mobile Apps', icon: Smartphone, cat: 'Development', duration: '5 Months', highlights: ['React Native', 'Cross-platform', 'App Store Ready'] },
  { title: 'QA & Testing', icon: TestTube, cat: 'Testing', duration: '4 Months', highlights: ['Selenium & Cypress', 'API Testing', 'CI/CD'] },
  { title: 'Business Analytics', icon: ChartColumn, cat: 'Analytics', duration: '3 Months', highlights: ['Excel & SQL', 'Power BI', 'Case Studies'] },
  { title: 'Data Analytics', icon: Database, cat: 'Analytics', duration: '4 Months', highlights: ['Python for Data', 'Statistics', 'Real Datasets'] },
  { title: 'Data Science', icon: Database, cat: 'Analytics', duration: '6 Months', highlights: ['Machine Learning', 'Deep Learning', 'Capstone'] },
];

export default function CoursesPage() {
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? courses : courses.filter((course) => course.cat === category);

  function getWhatsappLink(courseTitle: string) {
    const message = `Hi DigitBuild, I want to know more about the ${courseTitle} course.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main className="pt-nav">
      <section className="section-padding">
        <div className="container-custom">
          <Reveal>
            <SectionEyebrow>Courses</SectionEyebrow>
            <SectionTitle className="mb-3">
              Learn what the industry <span className="hero-title-muted">actually needs</span>
            </SectionTitle>
            <p className="page-hero-copy left-copy">8 programs built by practitioners. Focused on outcomes, not theory.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="filter-row">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`filter-chip ${category === item ? 'is-active' : ''}`}>
                  {item}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="card-grid card-grid-3">
            {filtered.map((course, index) => (
              <Reveal key={course.title} delay={index * 0.05}>
                <div className="course-card">
                  <div className="course-card-bar" />
                  <div className="course-card-body">
                    <course.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{course.title}</h3>
                    <div className="feature-list">
                      {course.highlights.map((item) => (
                        <div key={item} className="feature-item">
                          <Check className="feature-check" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="course-footer">
                      <span className="duration-chip">{course.duration}</span>
                      <Link to="/contact" className="inline-link">
                        Learn more <ArrowRight className="inline-link-icon" />
                      </Link>
                    </div>
                    <a
                      href={getWhatsappLink(course.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="whatsapp-link"
                    >
                      <MessageCircle className="inline-link-icon" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
