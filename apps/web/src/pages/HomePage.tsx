import {
  BookOpen,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit2,
  Eye,
  EyeOff,
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
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { Counter } from '../components/ui/Counter';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { careerPackages, type CareerPackage } from '../lib/payment';
import { sanityClient } from '../lib/sanity';
import { useSanityData } from '../lib/useSanityData';
import { useToast } from '../components/toast/ToastProvider';
import { API_BASE } from '../config/api';

const stats = [
  { value: 5000, suffix: '+', label: 'Resumes Written' },
  { value: 2000, suffix: '+', label: 'LinkedIn Profiles Optimized' },
  { value: 70, suffix: '%+', label: 'Interview Conversion' },
  { value: 98, suffix: '%', label: 'Candidates Placed' },
  { value: 15, suffix: '+', label: 'Countries Served' },
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
    desc: 'Rank higher on Naukri with an ATS-focused resume that improves visibility and speeds up your job search.',
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
    desc: 'Find better remote roles with guided job search and practical support that helps you convert opportunities faster.',
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
    desc: 'Launch your internship journey with a thoughtfully structured resume that helps you stand out in a competitive job market.',
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
  {
    name: 'Priya Deshmukh',
    role: 'React Developer',
    company: 'Cognizant',
    hike: '61%',
    quote: 'The mock interviews felt almost identical to the real ones. By the time my final round came, I was ready with sharper answers and much better confidence.',
  },
  {
    name: 'Kunal Verma',
    role: 'Backend Developer',
    company: 'HCLTech',
    hike: '56%',
    quote: 'My resume was rewritten around actual recruiter expectations. That one change alone increased responses, and the interview coaching helped me convert them.',
  },
  {
    name: 'Ishita Rao',
    role: 'Business Analyst',
    company: 'Deloitte',
    hike: '44%',
    quote: 'I was struggling to explain my projects in a business-friendly way. DigitBuild helped me position my work properly and that made a huge difference.',
  },
  {
    name: 'Harsh Vyas',
    role: 'QA Automation Engineer',
    company: 'Tech Mahindra',
    hike: '52%',
    quote: 'They didn’t just teach testing tools. They helped me structure my profile, improve my project stories, and apply strategically to the right roles.',
  },
  {
    name: 'Mitali Shah',
    role: 'Data Analyst',
    company: 'Infosys BPM',
    hike: '49%',
    quote: 'The biggest win for me was clarity. I knew exactly how to present my dashboards, what to say in interviews, and how to follow up professionally.',
  },
  {
    name: 'Nikhil Bhosale',
    role: 'Full Stack Developer',
    company: 'LTIMindtree',
    hike: '68%',
    quote: 'From portfolio feedback to final HR negotiation, the support never dropped. I felt like someone was genuinely tracking my progress throughout.',
  },
  {
    name: 'Rutuja More',
    role: 'Software Test Engineer',
    company: 'Wipro',
    hike: '46%',
    quote: 'My Naukri profile barely got noticed before. After optimization and resume updates, I started receiving calls from companies I had been targeting for months.',
  },
  {
    name: 'Abhishek Nair',
    role: 'Power BI Developer',
    company: 'Accenture',
    hike: '57%',
    quote: 'The guidance was practical and direct. Every review call had specific improvements I could act on immediately, which made the process much faster.',
  },
  {
    name: 'Sakshi Jain',
    role: 'Junior Data Scientist',
    company: 'IBM',
    hike: '63%',
    quote: 'I had technical knowledge but weak storytelling. They helped me explain my projects in a way that showed impact, not just tools used.',
  },
  {
    name: 'Aditya Kulkarni',
    role: 'Java Developer',
    company: 'Capgemini',
    hike: '51%',
    quote: 'The interview preparation was extremely realistic. We covered coding questions, project discussions, and HR rounds, so nothing felt unfamiliar later.',
  },
  {
    name: 'Pooja Singh',
    role: 'Operations Analyst',
    company: 'Genpact',
    hike: '42%',
    quote: 'I wanted to switch into a more analytical role and they mapped the transition clearly. The profile positioning they did was spot on.',
  },
  {
    name: 'Manav Arora',
    role: 'Frontend Engineer',
    company: 'Persistent',
    hike: '66%',
    quote: 'They pushed me to improve my project quality and presentation. That gave me stronger talking points and helped me stand out against other applicants.',
  },
  {
    name: 'Shreya Kulshrestha',
    role: 'HR Analyst',
    company: 'EY',
    hike: '39%',
    quote: 'The personal attention was the best part. My doubts were never brushed aside, and every suggestion on my profile felt intentional and customized.',
  },
  {
    name: 'Rahul Soni',
    role: 'Cloud Support Engineer',
    company: 'Oracle',
    hike: '54%',
    quote: 'They helped me frame my support experience into a stronger technical profile. That repositioning changed the kind of interviews I started getting.',
  },
  {
    name: 'Ananya Ghosh',
    role: 'UI Developer',
    company: 'Cognizant',
    hike: '59%',
    quote: 'The resume and LinkedIn rewrite made my profile look much more mature. Recruiters started seeing me as a serious candidate instead of a fresher.',
  },
  {
    name: 'Siddharth Patil',
    role: 'DevOps Engineer',
    company: 'Larsen & Toubro',
    hike: '62%',
    quote: 'I liked that the preparation was outcome-focused. We spent time on what employers actually ask, not on random generic advice.',
  },
  {
    name: 'Megha Joshi',
    role: 'Manual Tester',
    company: 'Hexaware',
    hike: '43%',
    quote: 'My confidence improved because I finally knew how to explain my bug reports, test cases, and project work in a professional way.',
  },
  {
    name: 'Yash Chavan',
    role: 'Associate Software Engineer',
    company: 'Tata Elxsi',
    hike: '47%',
    quote: 'As a fresher, I needed structure more than anything. DigitBuild gave me a roadmap, regular reviews, and the right pressure to stay consistent.',
  },
  {
    name: 'Komal Agarwal',
    role: 'SQL Developer',
    company: 'DXC Technology',
    hike: '53%',
    quote: 'Their feedback on small details like keywords, project phrasing, and recruiter communication had a surprisingly big impact on my results.',
  },
  {
    name: 'Amanpreet Kaur',
    role: 'Product Support Analyst',
    company: 'Concentrix',
    hike: '38%',
    quote: 'I was changing domains and felt stuck. They simplified the transition, strengthened my profile, and kept me focused through the whole application cycle.',
  },
  {
    name: 'Devansh Tripathi',
    role: 'Python Developer',
    company: 'Infosys',
    hike: '55%',
    quote: 'The best part was how practical everything was. Every call ended with exact improvements and those changes started showing results quickly.',
  },
  {
    name: 'Nandini Iyer',
    role: 'Reporting Analyst',
    company: 'KPMG',
    hike: '45%',
    quote: 'They helped me turn my raw experience into a cleaner professional narrative. That made me far more confident while speaking to recruiters.',
  },
  {
    name: 'Rakesh Yadav',
    role: 'Mobile App Developer',
    company: 'Tech Mahindra',
    hike: '64%',
    quote: 'The combination of project review, interview prep, and job application guidance worked really well. I had support at each stage, not just one.',
  },
  {
    name: 'Simran Bedi',
    role: 'Data Operations Specialist',
    company: 'Sutherland',
    hike: '41%',
    quote: 'I felt more organized within the first week itself. My resume, profile, and application strategy were finally aligned instead of scattered.',
  },
  {
    name: 'Varun Malhotra',
    role: 'Software Developer',
    company: 'Zensar',
    hike: '58%',
    quote: 'They helped me present my previous experience as relevant instead of outdated. That one shift changed how interviewers responded to my profile.',
  },
  {
    name: 'Deepa Narayanan',
    role: 'Business Intelligence Analyst',
    company: 'Mu Sigma',
    hike: '50%',
    quote: 'The support felt both honest and motivating. They pointed out exactly what was weak in my profile, and then helped me fix it properly.',
  },
];

const placedCompanies = [
  'TCS',
  'Infosys',
  'Wipro',
  'Accenture',
  'Capgemini',
  'Cognizant',
  'Tech Mahindra',
  'Persistent',
  'HCLTech',
  'IBM',
  'Oracle',
  'Deloitte',
  'EY',
  'KPMG',
  'PwC',
  'LTIMindtree',
  'Mphasis',
  'DXC Technology',
  'Hexaware',
  'L&T Technology Services',
  'Larsen & Toubro',
  'Tata Elxsi',
  'Birlasoft',
  'Zensar',
  'Cybage',
  'Amdocs',
  'Synechron',
  'Virtusa',
  'Atos',
  'Fujitsu',
  'NTT DATA',
  'Sopra Steria',
  'Nagarro',
  'EPAM',
  'UST',
  'Thoughtworks',
  'Publicis Sapient',
  'GlobalLogic',
  'Coforge',
  'KPIT',
  'Sasken',
  'Quest Global',
  'Honeywell',
  'Siemens',
  'Bosch',
  'Schneider Electric',
  'Emerson',
  'Philips',
  'Airtel',
  'Jio',
  'Vodafone Idea',
  'Amazon',
  'Amazon Web Services',
  'Google',
  'Microsoft',
  'Meta',
  'Apple',
  'Netflix',
  'Adobe',
  'Salesforce',
  'SAP',
  'ServiceNow',
  'Zoho',
  'Freshworks',
  'Intuit',
  'PayPal',
  'Visa',
  'Mastercard',
  'American Express',
  'JPMorgan Chase',
  'Morgan Stanley',
  'Goldman Sachs',
  'Barclays',
  'HSBC',
  'Standard Chartered',
  'UBS',
  'Deutsche Bank',
  'BNY Mellon',
  'Northern Trust',
  'State Street',
  'Bank of America',
  'Wells Fargo',
  'Citi',
  'Nomura',
  'Morningstar',
  'NielsenIQ',
  'Mu Sigma',
  'Fractal Analytics',
  'Tiger Analytics',
  'Genpact',
  'EXL',
  'Concentrix',
  'Sutherland',
  'Teleperformance',
  'CGI',
  'Collabera',
  'Randstad Digital',
  'Adecco',
  'Alight Solutions',
  'Cerner',
  'Dassault Systemes',
  'Autodesk',
  'Infor',
  'Workday',
  'OpenText',
  'Red Hat',
  'VMware',
  'Cisco',
  'Juniper Networks',
  'Dell Technologies',
  'HP',
  'Lenovo',
  'Xoriant',
  'eClerx',
  'Capco',
  'Brillio',
  'Datamatics',
  'R Systems',
  'Newgen Software',
  'Mindtree',
  'Apexon',
];
const placedCompaniesMarquee = [...placedCompanies, ...placedCompanies];
const whatsappNumber = '+917385490573';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parsePriceToAmount(price: string) {
  const value = Number(price.replace(/[^\d]/g, ''));
  return Number.isFinite(value) ? value * 100 : 0;
}

function formatDisplayPriceFromRupees(amountInRupees: number) {
  return `Rs ${Math.round(amountInRupees)}`;
}

function serializeList(items: string[] = []) {
  return items.join('\n');
}

function parseList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: sanityCareerPackages, loading: packagesLoading } = useSanityData<CareerPackage[]>(`*[_type == "placementPackage"] | order(amount asc)`);
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState<-1 | 0 | 1>(0);
  const [isTestimonialAnimating, setIsTestimonialAnimating] = useState(false);
  const [isTestimonialResetting, setIsTestimonialResetting] = useState(false);
  const [selectedCareerOffering, setSelectedCareerOffering] = useState<(typeof careerOfferings)[number] | null>(null);
  const [dynamicCareerPackages, setDynamicCareerPackages] = useState<CareerPackage[]>(careerPackages);
  const [selectedCareerPackage, setSelectedCareerPackage] = useState<CareerPackage | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasSeededPackages, setHasSeededPackages] = useState(false);
  const [isManagingPackage, setIsManagingPackage] = useState(false);
  const [isSavingPackage, setIsSavingPackage] = useState(false);
  const [isConfirmingPackageDelete, setIsConfirmingPackageDelete] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState<any>({
    name: '',
    slug: '',
    experience: '',
    price: '',
    amount: '',
    features: '',
  });
  const careerPackageDialogRef = useRef<HTMLDialogElement | null>(null);
  const packageManageDialogRef = useRef<HTMLDialogElement | null>(null);
  const packageConfirmDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin');
  }, []);

  useEffect(() => {
    if (sanityCareerPackages && sanityCareerPackages.length > 0) {
      setDynamicCareerPackages(sanityCareerPackages);
    }
  }, [sanityCareerPackages]);

  useEffect(() => {
    const seedDefaultPackages = async () => {
      if (!isAdmin || hasSeededPackages || packagesLoading || !sanityCareerPackages || sanityCareerPackages.length > 0) return;
      setHasSeededPackages(true);

      try {
        await Promise.all(
          careerPackages.map((pkg) =>
            sanityClient.createIfNotExists({
              ...pkg,
              isVisible: true,
              _id: `placementPackage-${pkg.slug}`,
              _type: 'placementPackage',
            }),
          ),
        );
        await fetchCareerPackages();
      } catch (error) {
        console.error('Placement package seed error:', error);
      }
    };

    void seedDefaultPackages();
  }, [hasSeededPackages, isAdmin, packagesLoading, sanityCareerPackages]);

  useEffect(() => {
    const dialog = careerPackageDialogRef.current;
    if (!dialog) return;

    if (selectedCareerOffering) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [selectedCareerOffering]);

  useEffect(() => {
    const dialog = packageManageDialogRef.current;
    if (!dialog) return;
    if (isManagingPackage) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isManagingPackage]);

  useEffect(() => {
    const dialog = packageConfirmDialogRef.current;
    if (!dialog) return;
    if (isConfirmingPackageDelete) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isConfirmingPackageDelete]);

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

  function getCareerSupportWhatsappLink(offeringTitle: string) {
    const message = `Hi DigitBuild, I want to know more about your ${offeringTitle} service.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function openCareerPackageModal(offering: (typeof careerOfferings)[number]) {
    setSelectedCareerPackage(null);
    setSelectedCareerOffering(offering);
  }

  function closeCareerPackageModal() {
    setSelectedCareerPackage(null);
    setSelectedCareerOffering(null);
  }

  function handleProceedToPayment() {
    if (!selectedCareerPackage) return;

    closeCareerPackageModal();
    navigate(`/placement-payment?package=${encodeURIComponent(selectedCareerPackage.slug)}`);
  }

  async function fetchCareerPackages() {
    try {
      const data = await sanityClient.fetch<CareerPackage[]>(`*[_type == "placementPackage"] | order(amount asc)`);
      setDynamicCareerPackages(data.length > 0 ? data : careerPackages);
    } catch (error) {
      console.error('Failed to fetch placement packages');
    }
  }

  function openPackageManage(pkg?: CareerPackage) {
    if (pkg) {
      const amountInRupees = Number.isFinite(pkg.amount) ? pkg.amount / 100 : Number(pkg.price.replace(/[^\d]/g, ''));
      setPackageForm({
        ...pkg,
        price: formatDisplayPriceFromRupees(amountInRupees),
        amount: String(amountInRupees),
        features: serializeList(pkg.features),
      });
    } else {
      setPackageForm({
        name: '',
        slug: '',
        experience: '',
        price: '',
        amount: '',
        features: '',
      });
    }
    setIsManagingPackage(true);
  }

  async function handleSavePackage(event: React.FormEvent) {
    event.preventDefault();
    setIsSavingPackage(true);

    const amountInRupees = Number(packageForm.amount) || Number(packageForm.price.replace(/[^\d]/g, ''));
    const normalizedRupees = Math.max(1, Math.round(amountInRupees));
    const payload = {
      _type: 'placementPackage',
      slug: packageForm.slug || slugify(packageForm.name),
      name: packageForm.name,
      experience: packageForm.experience,
      price: formatDisplayPriceFromRupees(normalizedRupees),
      amount: normalizedRupees > 0 ? normalizedRupees * 100 : parsePriceToAmount(packageForm.price),
      currency: 'INR' as const,
      features: parseList(packageForm.features),
      isVisible: packageForm.isVisible !== false,
    };

    try {
      if (packageForm._id) {
        const response = await fetch(`${API_BASE}/api/placement-packages/${packageForm._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update package');
      } else {
        const response = await fetch(`${API_BASE}/api/placement-packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create package');
      }
      setIsManagingPackage(false);
      await fetchCareerPackages();
      showToast('Package Saved', `${payload.name} has been updated successfully.`, 'success');
    } catch (error) {
      console.error('Placement package save error:', error);
      showToast('Save Failed', 'Could not save the placement package. Check your Sanity token permissions.', 'error');
    } finally {
      setIsSavingPackage(false);
    }
  }

  async function confirmPackageDelete() {
    if (!isConfirmingPackageDelete) return;
    setIsSavingPackage(true);

    try {
      const response = await fetch(`${API_BASE}/api/placement-packages/${isConfirmingPackageDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete package');
      setIsConfirmingPackageDelete(null);
      if (selectedCareerPackage?._id === isConfirmingPackageDelete) setSelectedCareerPackage(null);
      await fetchCareerPackages();
      showToast('Package Deleted', 'The placement support package has been removed.', 'success');
    } catch (error) {
      console.error('Placement package delete error:', error);
      showToast('Delete Failed', 'You do not have permission to delete this package.', 'error');
    } finally {
      setIsSavingPackage(false);
    }
  }

  async function togglePackageVisibility(pkg: CareerPackage) {
    if (!pkg._id) return;
    setIsSavingPackage(true);
    const payload = {
      slug: pkg.slug,
      name: pkg.name,
      experience: pkg.experience,
      price: pkg.price,
      amount: pkg.amount,
      currency: 'INR' as const,
      features: pkg.features || [],
      isVisible: pkg.isVisible === false,
    };

    try {
      const response = await fetch(`${API_BASE}/api/placement-packages/${pkg._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update package visibility');
      await fetchCareerPackages();
      showToast(pkg.isVisible === false ? 'Package Unhidden' : 'Package Hidden', `${pkg.name} visibility updated.`, 'success');
    } catch (error) {
      console.error('Placement package visibility error:', error);
      showToast('Update Failed', 'Could not update package visibility.', 'error');
    } finally {
      setIsSavingPackage(false);
    }
  }

  const visiblePlacementPackages = isAdmin ? dynamicCareerPackages : dynamicCareerPackages.filter((pkg) => pkg.isVisible !== false);

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
                Job-oriented IT training programs with industry-aligned courses, Job Placement support, and real-world software development solutions. Learn in-demand skills like Java, Full Stack Development, Data Analytics, and Cloud Computing with hands-on projects.
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
              <div className="hero-glow" />
              <div className="hero-chip-row hero-chip-row-top">
                <div className="hero-chip hero-chip-top">
                  <Sparkles strokeWidth={1.8} />
                  Placement-first learning
                </div>
              </div>
              <div className="hero-chip-row hero-chip-row-bottom">
                <div className="hero-chip hero-chip-bottom">
                  <Shield strokeWidth={1.8} />
                  Real projects, real support
                </div>
              </div>
              <div className="hero-card-stack">
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
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>About</SectionEyebrow>
            <SectionTitle className="mb-12">What makes us different</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {aboutCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <div className="info-card">
                  <div className="card-header-inline card-header-inline-center">
                    <card.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{card.title}</h3>
                  </div>
                  <p className="card-copy-center">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-padding surface-section section-anchor">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Services</SectionEyebrow>
            <SectionTitle className="mb-12">Everything you need under one roof</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.06}>
                <Link to={service.to} className="service-card-link">
                  <div className="info-card">
                    <div className="card-header-inline card-header-inline-center">
                      <service.icon className="info-icon" strokeWidth={1.5} />
                      <h3>{service.title}</h3>
                    </div>
                    <p className="card-copy-center">{service.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="career-support" className="section-padding section-anchor">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Placement Support</SectionEyebrow>
            <SectionTitle className="mb-3">Placement support that goes beyond advice</SectionTitle>
            <p className="page-hero-copy">
              We create ATS-friendly resumes designed to pass applicant tracking systems and reach hiring managers, helping you stand out in today&apos;s competitive job market. Our experts also optimize your Naukri, LinkedIn, and other profiles with the right keywords and positioning to boost visibility, increase calls, and secure more interview opportunities faster.
            </p>
          </Reveal>

          <div className="card-grid card-grid-3 career-support-grid">
            {careerOfferings.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="info-card info-card-with-action career-support-card">
                  <div className="card-header-inline">
                    <item.icon className="info-icon" strokeWidth={1.5} />
                    <h3>{item.title}</h3>
                  </div>
                  <p className="card-copy-left">{item.desc}</p>
                  <div className="career-support-card-actions">
                    <button type="button" className="btn btn-pill btn-sm career-buy-button" onClick={() => openCareerPackageModal(item)}>
                      <CreditCard className="btn-icon" />
                      Buy Now
                    </button>
                    <a href={getCareerSupportWhatsappLink(item.title)} target="_blank" rel="noreferrer" className="whatsapp-link whatsapp-link-card">
                      <MessageSquare className="inline-link-icon" />
                      Chat Now
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <dialog
        ref={careerPackageDialogRef}
        className="course-modal"
        onClose={closeCareerPackageModal}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeCareerPackageModal();
          }
        }}
      >
        {selectedCareerOffering ? (
          <div className="course-modal-panel" aria-labelledby="career-package-modal-title" aria-describedby="career-package-modal-desc">
            <div className="course-modal-header">
              <div>
                <span className="course-modal-kicker">Placement Support</span>
                <h2 id="career-package-modal-title" className="course-modal-title">
                  Placement Support Packages
                </h2>
                <p id="career-package-modal-desc" className="course-modal-copy">
                  Choose a package that fits your experience level. These package options are available across all placement support services.
                </p>
              </div>
              <button type="button" className="course-modal-close" onClick={closeCareerPackageModal} aria-label="Close package selection" autoFocus>
                <X />
              </button>
            </div>

            <div className="career-package-row" aria-label="Placement support packages">
              {visiblePlacementPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  role="button"
                  tabIndex={0}
                  className={`course-detail-panel course-detail-panel-modal career-package-card${selectedCareerPackage?.slug === pkg.slug ? ' is-selected' : ''}`}
                  onClick={() => setSelectedCareerPackage(pkg)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedCareerPackage(pkg);
                    }
                  }}
                  aria-pressed={selectedCareerPackage?.slug === pkg.slug}
                >
                  {isAdmin && pkg._id ? (
                    <span className="career-package-admin-actions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="icon-btn-small" title={pkg.isVisible === false ? 'Unhide package' : 'Hide package'} onClick={() => togglePackageVisibility(pkg)}>
                        {pkg.isVisible === false ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button type="button" className="icon-btn-small" title="Edit package" onClick={() => openPackageManage(pkg)}>
                        <Edit2 size={14} />
                      </button>
                      <button type="button" className="icon-btn-small text-danger" title="Delete package" onClick={() => setIsConfirmingPackageDelete(pkg._id || null)}>
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ) : null}
                  {selectedCareerPackage?.slug === pkg.slug ? (
                    <span className="career-package-selected" aria-hidden="true">
                      <Check size={14} />
                    </span>
                  ) : null}
                  <div className="course-detail-block">
                    <p className="course-detail-label">{pkg.experience}</p>
                    <h3>{pkg.name}</h3>
                    <p className="course-detail-copy">{pkg.price}</p>
                  </div>
                  <div className="course-detail-block">
                    <p className="course-detail-label">Includes</p>
                    <ul className="course-detail-list">
                      {pkg.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="course-detail-actions course-detail-actions-modal">
              {isAdmin ? (
                <button type="button" className="btn btn-pill-outline btn-sm" onClick={() => openPackageManage()}>
                  <CreditCard className="btn-icon" />
                  New Package
                </button>
              ) : null}
              <button type="button" className="btn btn-pill btn-sm" disabled={!selectedCareerPackage} aria-disabled={!selectedCareerPackage} onClick={handleProceedToPayment}>
                Proceed to payment
              </button>
            </div>
          </div>
        ) : null}
      </dialog>

      <dialog ref={packageManageDialogRef} className="course-modal" onClose={() => setIsManagingPackage(false)}>
        <div className="admin-modal-panel">
          <div className="admin-header">
            <h2>{packageForm._id ? 'Refine Package' : 'Create New Package'}</h2>
            <button type="button" className="course-modal-close" onClick={() => setIsManagingPackage(false)}><X /></button>
          </div>

          <form onSubmit={handleSavePackage}>
            <div className="admin-form-body">
              <div className="form-section">
                <span className="form-section-title">Package Information</span>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Package Name</label>
                    <input className="admin-input" type="text" value={packageForm.name} onChange={event => setPackageForm({...packageForm, name: event.target.value, slug: packageForm.slug || slugify(event.target.value)})} required placeholder="e.g. Mid-Level Pro" />
                  </div>
                  <div className="admin-field">
                    <label>Slug</label>
                    <input className="admin-input" type="text" value={packageForm.slug} onChange={event => setPackageForm({...packageForm, slug: slugify(event.target.value)})} required placeholder="e.g. mid-level-pro" />
                  </div>
                  <div className="admin-field">
                    <label>Experience Label</label>
                    <input className="admin-input" type="text" value={packageForm.experience} onChange={event => setPackageForm({...packageForm, experience: event.target.value})} required placeholder="e.g. 2 to 5 year" />
                  </div>
                  <div className="admin-field">
                    <label>Display Price</label>
                    <input className="admin-input" type="text" value={packageForm.price || (packageForm.amount ? formatDisplayPriceFromRupees(Number(packageForm.amount)) : '')} readOnly aria-readonly="true" placeholder="Auto from payment amount" />
                  </div>
                  <div className="admin-field">
                    <label>Payment Amount (INR)</label>
                    <input className="admin-input" type="number" min="1" value={packageForm.amount} onChange={event => setPackageForm({...packageForm, amount: event.target.value, price: event.target.value ? formatDisplayPriceFromRupees(Number(event.target.value)) : ''})} required placeholder="3499" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <span className="form-section-title">Includes</span>
                <div className="admin-field">
                  <label>Features (One per line)</label>
                  <textarea className="admin-textarea admin-textarea-tall" value={packageForm.features} onChange={event => setPackageForm({...packageForm, features: event.target.value})} required placeholder="ATS-optimised resume&#10;LinkedIn Optimization&#10;Call Support" />
                </div>
              </div>
            </div>

            <div className="admin-footer">
              <button type="button" className="btn-admin-cancel" onClick={() => setIsManagingPackage(false)} disabled={isSavingPackage}>Cancel</button>
              <button type="submit" className="btn-admin-save" disabled={isSavingPackage}>
                {isSavingPackage ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog ref={packageConfirmDialogRef} className="course-modal" onClose={() => setIsConfirmingPackageDelete(null)}>
        <div className="confirm-modal-panel glass">
          <div className="confirm-icon-wrap">
            <Trash2 size={32} />
          </div>
          <h2 className="confirm-title">Are you sure?</h2>
          <p className="confirm-text">
            This action will permanently delete the placement support package. This cannot be undone.
          </p>
          <div className="confirm-actions">
            <button className="btn btn-ghost flex-1" onClick={() => setIsConfirmingPackageDelete(null)} disabled={isSavingPackage}>No, Cancel</button>
            <button className="btn btn-danger flex-1" onClick={confirmPackageDelete} disabled={isSavingPackage}>
              {isSavingPackage ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </dialog>

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

      <section className="section-padding overflow-hidden">
        <div className="container-custom mb-12">
          <Reveal className="home-section-intro">
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
                  <div className="testimonial-meta">
                    <div className="testimonial-user">
                      <div className="avatar">{testimonial.name[0]}</div>
                      <div className="testimonial-user-copy">
                        <p className="testimonial-name">{testimonial.name}</p>
                        <p className="testimonial-role">{testimonial.role}</p>
                        <p className="testimonial-company">{testimonial.company}</p>
                      </div>
                    </div>
                    <span className="hike-badge">{testimonial.hike} hike</span>
                  </div>
                  <div className="testimonial-body">
                    <Quote className="testimonial-quote" />
                    <p className="testimonial-copy">"{testimonial.quote}"</p>
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

      <section className="section-padding surface-section">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Placed At</SectionEyebrow>
            <SectionTitle className="mb-12">Companies where candidates got placed</SectionTitle>
          </Reveal>
          <div className="company-marquee">
            <div className="company-track">
              {placedCompaniesMarquee.map((company, index) => (
                <div key={`${company}-${index}`} className="company-pill">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="home-section-intro">
            <SectionEyebrow>Why DigitBuild</SectionEyebrow>
            <SectionTitle className="mb-12">Why learners choose DigitBuild</SectionTitle>
          </Reveal>
          <div className="card-grid card-grid-3">
            {reasons.map((item, index) => (
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
    </main>
  );
}
