import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CheckClickSignatureDto {
    @IsNumber()
    click_trans_id?: any;

    @IsNumber()
    service_id?: any;

    @IsString()
    merchant_trans_id?: any

    @IsNumber()
    amount?: any;

    @IsNumber()
    merchant_prepare_id?: any;

    @IsNumber()
    action?: any;

    @IsString()
    sign_time?: any;

    @IsString()
    sign_string?: any;
}
