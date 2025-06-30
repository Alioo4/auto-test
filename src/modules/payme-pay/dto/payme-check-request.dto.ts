export class PaymeCheckRequestDto {
    id: number;
    method: string;
    params: {
        amount: number;
        account: {
            order_id: number;
        };
    };
}
