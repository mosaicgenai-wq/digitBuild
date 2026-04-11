export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  jobRole: string;
  designation: string;
  experience: string;
  subject: string;
  message: string;
};

export async function submitContactForm(payload: ContactPayload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to submit the form right now.');
  }

  return response.json();
}
