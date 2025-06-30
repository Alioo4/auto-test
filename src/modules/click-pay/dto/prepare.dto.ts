export class PrepareClickPayDto {
    click_trans_id: number;
    service_id: number;
    merchant_trans_id: string;
    amount: number;
    action: number;
    error: number;
    sign_time: string;
    sign_string: string;
}
