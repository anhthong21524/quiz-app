import { Body, Controller, Get, Put, Req } from "@nestjs/common";
import type { Request } from "express";
import { UpdateSubjectDomainsDto } from "../application/dto/update-subject-domains.dto";
import { ConfigurationService, ConfigurationUser } from "../application/configuration.service";

interface AuthenticatedRequest extends Request {
  user: ConfigurationUser;
}

@Controller("configuration")
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  getConfiguration(@Req() request: AuthenticatedRequest) {
    return this.configurationService.getConfiguration(request.user);
  }

  @Put("subject-domains")
  updateSubjectDomains(
    @Body() payload: UpdateSubjectDomainsDto,
    @Req() request: AuthenticatedRequest
  ) {
    return this.configurationService.updateSubjectDomains(
      request.user,
      payload.subjectDomains
    );
  }
}
