import Payment_Confirmation_Template from '../../../template/email/payment.template.js';

class Email_Service {
  // sendReviewMail = async ({ recipientEmail, name, uniqueId }) => {
  //   try {
  //     let { error } = Review_Validator.validate({
  //       recipientEmail,
  //       name,
  //       uniqueId,
  //     });

  //     if (error) {
  //       throw new Error(error.details[0].message);
  //     }

  //     let Send_Review_Mail = await EmailUtils.sendReviewMail({
  //       recipientEmail,
  //       name,
  //       uniqueId,
  //     });
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

  sendPaymentConfirmation = async ({
    studentName,
    studentId,
    paymentId,
    totalAmountDue,
    amountPaid,
    email,
  }) => {
    try {
      const result = await Payment_Confirmation_Template({
        studentName,
        studentId,
        paymentId,
        totalAmountDue,
        amountPaid,
        email,
      });
      return result; // ✅ Return the result
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Email_Service();
