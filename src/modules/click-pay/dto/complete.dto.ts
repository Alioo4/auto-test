import { IsEnum, IsNumber, IsString } from "class-validator";

export class CompleteClickPayDto {
    @IsNumber()
    click_trans_id: number;

    @IsNumber()
    service_id: number;

    @IsString()
    merchant_trans_id: string;

    @IsNumber()
    merchant_prepare_id: number;

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
