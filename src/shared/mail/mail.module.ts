import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailtrapMailProvider } from './providers/mailtrap/mailtrap-mail.provider';
import { MAIL_PROVIDER } from './mail.constants';
import { MailProvider } from './interfaces/mail-provider.interface';

@Module({
  providers: [
    MailService,
    {
      provide: MAIL_PROVIDER,
      useClass: MailtrapMailProvider,
    },
  ],
  exports: [MailService],
})
export class MailModule {}