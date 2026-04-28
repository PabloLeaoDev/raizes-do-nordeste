export async function processPaymentMock() {
    const success = Math.random() > 0.2;

    return {
        success,
        transactionId: Date.now(),
        timestamp: new Date()
    };
}