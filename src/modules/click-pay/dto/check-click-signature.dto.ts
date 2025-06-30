import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CheckClickSignatureDto {
    @IsNumber()
    click_trans_id?: number;

    @IsNumber()
    service_id?: number;

    @IsString()
    merchant_trans_id?: string;

    @IsNumber()
    amount?: number;

    @IsNumber()
    merchant_prepare_id?: number;

    @IsNumber()
    action?: number;

    @IsString()
    sign_time?: string;

    @IsString()
    sign_string?: string;
}
