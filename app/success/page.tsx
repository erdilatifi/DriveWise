import { redirect } from 'next/navigation';

export default function SuccessPage() {
  redirect('/payment/success');
}
