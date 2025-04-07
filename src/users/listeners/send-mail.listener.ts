import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class SendMailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    await this.mailService.sendUserWelcome(event.email, event.fullName);
  }
}