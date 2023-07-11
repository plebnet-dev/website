import { paymentStatus } from '../../store.js';

export async function post(req, res) {
  // Update the payment status in the store
  console.log('this is working')
  paymentStatus.set(true);

  return res.status(200).json({ status: true });
}