import { Download, Loader2, ReceiptText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Reveal } from '../components/ui/Reveal';
import { SectionEyebrow, SectionTitle } from '../components/ui/SectionIntro';
import { API_BASE } from '../config/api';

type ReceiptStatus = 'paid' | 'pending' | 'failed' | 'cancelled' | 'expired' | 'refunded';

type PaymentReceipt = {
  invoiceNumber: string;
  orderId: string;
  paymentId?: string;
  status: ReceiptStatus;
  packageName: string;
  amount: number;
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  jobRole: string;
  experience: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  failureDescription?: string;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

function formatDate(value?: string) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: ReceiptStatus) {
  const labels: Record<ReceiptStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    cancelled: 'Cancelled',
    expired: 'Expired',
    refunded: 'Refunded',
  };

  return labels[status];
}

function ReceiptDetail({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="receipt-detail-item">
      <span>{label}</span>
      <strong>{value || 'Not available'}</strong>
    </div>
  );
}

export default function PaymentReceiptPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let active = true;
    const currentOrderId = orderId;

    async function fetchReceipt() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/payments/${encodeURIComponent(currentOrderId)}/receipt`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Unable to load receipt.');
        }

        if (active) setReceipt(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load receipt.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchReceipt();

    return () => {
      active = false;
    };
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  const invoiceUrl = `${API_BASE}/api/payments/${encodeURIComponent(orderId)}/invoice.pdf`;

  return (
    <main className="pt-nav">
      <section className="section-padding receipt-section">
        <div className="container-custom receipt-container">
          <Reveal className="receipt-page-header">
            <SectionEyebrow>Payment Receipt</SectionEyebrow>
            <SectionTitle as="h1">Your invoice is ready</SectionTitle>
          </Reveal>

          {loading ? (
            <div className="receipt-state">
              <Loader2 className="admin-payments-spinner" size={22} />
              Loading receipt...
            </div>
          ) : error ? (
            <div className="receipt-state receipt-error">{error}</div>
          ) : receipt ? (
            <Reveal delay={0.06}>
              <div className="receipt-card">
                <div className="receipt-top">
                  <div className="receipt-title-wrap">
                    <div className="receipt-icon-wrap">
                      <ReceiptText />
                    </div>
                    <div>
                      <p className="receipt-kicker">{receipt.invoiceNumber}</p>
                      <h2>{receipt.packageName}</h2>
                    </div>
                  </div>
                  <span className={`payment-status-badge payment-status-${receipt.status}`}>
                    {getStatusLabel(receipt.status)}
                  </span>
                </div>

                <div className="receipt-amount-row">
                  <span>Amount</span>
                  <strong>{formatAmount(receipt.amount)}</strong>
                </div>

                <div className="receipt-detail-grid">
                  <ReceiptDetail label="Name" value={receipt.customerName} />
                  <ReceiptDetail label="Email" value={receipt.customerEmail} />
                  <ReceiptDetail label="Phone" value={receipt.customerPhone} />
                  <ReceiptDetail label="Job role" value={receipt.jobRole} />
                  <ReceiptDetail label="Experience" value={receipt.experience} />
                  <ReceiptDetail label="Order ID" value={receipt.orderId} />
                  <ReceiptDetail label="Payment ID" value={receipt.paymentId} />
                  <ReceiptDetail label="Issued at" value={formatDate(receipt.updatedAt || receipt.createdAt)} />
                  <ReceiptDetail label="Paid at" value={formatDate(receipt.paidAt)} />
                  {receipt.failureDescription ? <ReceiptDetail label="Failure details" value={receipt.failureDescription} /> : null}
                </div>

                <div className="receipt-actions">
                  <a href={invoiceUrl} className="btn btn-sm btn-pill" download>
                    <Download className="btn-icon" />
                    Download PDF
                  </a>
                  <Link to="/" className="btn btn-sm btn-pill-outline">
                    Back to home
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>
    </main>
  );
}
