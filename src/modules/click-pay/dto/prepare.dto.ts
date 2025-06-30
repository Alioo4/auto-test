import { IsEnum, IsNumber, IsString } from 'class-validator';

export class PrepareClickPayDto {
    @IsNumber()
    click_trans_id: number;

    @IsNumber()
    service_id: number;

    @IsString()
    merchant_trans_id: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    action: number;

    @IsNumber()
    error: number;

    @IsString()
    sign_time: string;

    @IsString()
    sign_string: string;
}
