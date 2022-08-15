import {PartialType} from "@nestjs/mapped-types";
import {Member} from "../model/member.model";

export class UpdateMemberDto extends PartialType(Member) {}