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
    @ApiProperty({nullable: true, enum: Status, default: Status.Inactive})
    status?: Status;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({default: false})
    verify?: boolean;

    @IsArray()
    @IsOptional()
    @ApiProperty({default: [Role.User]})
    roles?: string[]

}