import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MAIL_PROVIDER } from './mail.constants';
import { NodemailerMailProvider } from './providers/nodemailer/nodemailer-mail.provider';

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