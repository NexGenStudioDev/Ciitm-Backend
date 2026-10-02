import { jest } from '@jest/globals';

// Mock template dependency before importing service
jest.unstable_mockModule(
  '../../../../template/email/payment.template.js',
  () => ({
    default: jest
      .fn()
      .mockResolvedValue({ success: true, messageId: 'test-mail-id' }),
  })
);

const EmailService = (await import('../Email.service.mjs')).default;
const PaymentConfirmationTemplate = (
  await import('../../../../template/email/payment.template.js')
).default;

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send payment confirmation email successfully', async () => {
    const payload = {
      studentName: 'Alice Johnson',
      studentId: 'CIITM-101',
      paymentId: 'PAY-999',
      totalAmountDue: 5000,
      amountPaid: 5000,
      email: 'alice@example.com',
    };

    const result = await EmailService.sendPaymentConfirmation(payload);

    expect(PaymentConfirmationTemplate).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ success: true, messageId: 'test-mail-id' });
  });

  it('should handle template generation failure', async () => {
    PaymentConfirmationTemplate.mockRejectedValueOnce(new Error('Template render error'));

    await expect(
      EmailService.sendPaymentConfirmation({
        studentName: 'Bob',
        studentId: 'CIITM-102',
        paymentId: 'PAY-100',
        totalAmountDue: 2000,
        amountPaid: 2000,
        email: 'bob@example.com',
      })
    ).rejects.toThrow('Template render error');
  });
});
