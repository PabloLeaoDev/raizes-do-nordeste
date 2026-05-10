export class PaymentMockProvider {
  async processPayment(orderId: string, amount: number): Promise<{ success: boolean; transactionId?: string; timestamp: Date }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() < 0.8;
        const timestamp = new Date();

        if (isSuccess) {
          const transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
          console.log(`[PAYMENT MOCK] Order ${orderId} - SUCCESS: ${amount} approved. TXN: ${transactionId} at ${timestamp.toISOString()}`);
          resolve({ success: true, transactionId, timestamp });
        } else {
          console.log(`[PAYMENT MOCK] Order ${orderId} - FAILED: ${amount} declined at ${timestamp.toISOString()}`);
          resolve({ success: false, timestamp });
        }
      }, 500);
    });
  }
}
