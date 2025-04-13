// src/shared/mail/providers/nodemailer/nodemailer-mail.provider.ts

import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { MailProvider } from '../../interfaces/mail-provider.interface';

@Injectable()
export class NodemailerMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter;
  private readonly mailUser = process.env.MAIL_USER!;
  private readonly mailPassword = process.env.MAIL_PASSWORD!;
  private readonly mailHost = process.env.MAIL_HOST!;
  private readonly mailPort = process.env.MAIL_PORT!;
  private readonly logger = new Logger(NodemailerMailProvider.name);

  constructor() {

    if (!this.mailUser || !this.mailPassword || !this.mailHost || !this.mailPort) {
      this.logger.error('Configuração de e-mail ausente');
      throw new Error('Configuração de e-mail ausente');
    }
    

    this.transporter = nodemailer.createTransport({
      host: this.mailHost,
      port: parseInt(this.mailPort),
      auth: {
        user: this.mailUser,
        pass: this.mailPassword,
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