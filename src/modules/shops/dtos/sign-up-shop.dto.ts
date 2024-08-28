import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Role, Status } from "src/common/enums";

export class SignUpShopRequestDto{
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    password: string

    @IsEnum(Status)
    @IsOptional()
    @ApiPropertyOptional({nullable: true, enum: Status, default: Status.Inactive})
    status?: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({default: false})
    verify?: boolean;

    @IsArray()
    @IsEnum(Role, { each: true })
    @IsOptional()
    @ApiPropertyOptional({ type: [String], enum: Role, isArray: true, default: [] })
    roles?: Role

}