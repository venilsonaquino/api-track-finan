import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';  
import { MailProvider } from '../../interfaces/mail-provider.interface';

@Injectable()
export class NodemailerMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NodemailerMailProvider.name);
  private readonly mailerUser = process.env.MAILER_USER;
  private readonly mailerPassword = process.env.MAILER_PASSWORD;

  constructor() {

    if (!this.mailerUser) {
      this.logger.error('MAILER_USER não está definido');
      throw new Error('MAILER_USER não está definido');
    }

    if (!this.mailerPassword) {
      this.logger.error('MAILER_PASSWORD não está definido');
      throw new Error('MAILER_PASSWORD não está definido');
    }

    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: this.mailerUser,
        pass: this.mailerPassword,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Track Finanças" <no-reply@trackfinance.com>',
      to,
      subject,
      text,
    });
  }
}