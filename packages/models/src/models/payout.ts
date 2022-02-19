export class PayoutDetail {
  userId: string;
  createdAt: Date;
  payeeHandle: string;
  payerHandle: string;
  paymentAmount: number;
}

export class PayoutEvent {
  eventId: string;
  details: PayoutDetail;
}

export class Payout {
  startingAfter: string;
  endingBefore: string;
  events: PayoutEvent[];
}
