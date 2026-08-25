export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
export type PayoutStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface PaymentTransaction {
	id: number;
	userId: number;
	courseId: number;
	amount: number;
	currency: 'USD';
	status: PaymentStatus;
	transactionCode: string;
	payosCode?: string;
	qrCodeUrl?: string;
	checkoutUrl?: string;
	expiresAt: string;
	createdAt: string;
}

export interface PayoutRequest {
	id: number;
	teacherId: number;
	amount: number;
	status: PayoutStatus;
	createdAt: string;
	reviewedAt?: string;
	reviewedNote?: string;
}
