import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { NodemailerMailProvider } from './providers/nodemailer/nodemailer-mail.provider';
import { MAIL_PROVIDER } from './mail.constants';
import { MailProvider } from './interfaces/mail-provider.interface';

@Module({
  providers: [
    MailService,
    {
      provide: MAIL_PROVIDER,
      useClass: NodemailerMailProvider,
    },
  ],
  exports: [MailService],
})
export class MailModule {}