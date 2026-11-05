import {Router} from 'express';import Work from '../models/Work.js';
const r=Router();
r.get('/:token', async (req, res, next) => {
  try {
    const work = await Work.findOne({
      shareToken: req.params.token,
      shareEnabled: true
    })
      .populate('customer', 'name');

    if (!work) {
      return res.status(404).json({
        message: 'Work status link not found or disabled.'
      });
    }

    const totalReceived = work.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const remainingAmount =
      work.totalAmount - totalReceived;

    return res.json({
      name: work.name,
      customerName: work.customer?.name || 'Customer',

      status: work.status,

      totalAmount: work.totalAmount,
      totalReceived,
      remainingAmount,

      completed: work.completed,
      remaining: work.remaining,

      payments: work.payments,

      // Important: Send the video URL to the customer
      videoUrl: work.videoUrl || '',

      updatedAt: work.updatedAt
    });

  } catch (error) {
    next(error);
  }
});
export default r;
