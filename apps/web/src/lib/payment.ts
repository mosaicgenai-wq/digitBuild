export type CareerPackage = {
  _id?: string;
  _createdAt?: string;
  isVisible?: boolean;
  slug: string;
  name: string;
  experience: string;
  price: string;
  amount: number;
  currency: 'INR';
  features: string[];
};

export const careerPackages: CareerPackage[] = [
  {
    slug: 'fresher-launch',
    name: 'Fresher Launch',
    experience: '0 to 1 year',
    price: 'Rs 1999',
    amount: 199900,
    currency: 'INR',
    features: [
      'ATS-optimised fresher resume',
      'Naukri profile creation & keywords Optimization',
      'Guidance on first job applications',
      'Cover letter writing',
      'Salary negotiation Support',
    ],
  },
  {
    slug: 'mid-level-pro',
    name: 'Mid-Level Pro',
    experience: '2 to 5 year',
    price: 'Rs 3499',
    amount: 349900,
    currency: 'INR',
    features: [
      'ATS-optimised resume',
      'Naukri profile creation & keywords Optimization',
      'Career switch guidance',
      'LinkedIn Optimization',
      'Cover letter',
      'Call Support',
      'Salary negotiation Support',
    ],
  },
  {
    slug: 'senior-expert',
    name: 'Senior Expert',
    experience: '6 to 10 year',
    price: 'Rs 4999',
    amount: 499900,
    currency: 'INR',
    features: [
      'ATS-optimised resume',
      'Naukri profile creation & keywords Optimization',
      'Career switch guidance',
      'Cover letter',
      'Call Support',
      'Salary negotiation Support',
    ],
  },
  {
    slug: 'executive-elite',
    name: 'Executive Elite',
    experience: '10 + year',
    price: 'Rs 7999',
    amount: 799900,
    currency: 'INR',
    features: [
      'ATS-optimised resume',
      'Naukri profile Optimization',
      'LinkedIn Optimization',
      'Call Support',
      'Cover letter',
      'Salary negotiation Support',
    ],
  },
  {
    slug: 'remote-job-placement',
    name: 'Remote Job Placement',
    experience: 'For all experience',
    price: 'Rs 9999',
    amount: 999900,
    currency: 'INR',
    features: [
      'ATS-optimised resume (International Format)',
      'Naukri profile Optimization for Remote',
      'LinkedIn Optimization for Remote',
      'Call Support',
      'Cover letter',
      'Salary negotiation Support',
    ],
  },
];

export function getCareerPackageBySlug(slug: string | null) {
  if (!slug) return null;
  return careerPackages.find((pkg) => pkg.slug === slug) ?? null;
}
