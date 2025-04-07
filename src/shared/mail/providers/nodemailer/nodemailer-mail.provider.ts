// src/shared/mail/providers/nodemailer/nodemailer-mail.provider.ts

import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { MailProvider } from '../../interfaces/mail-provider.interface';

@Injectable()
export class NodemailerMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter;
  private readonly senderEmail = process.env.MAILTRAP_SENDER_EMAIL!;
  private readonly token = "061d8389f82b88c6480ec231538f3c90";
  private readonly logger = new Logger(NodemailerMailProvider.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: "d7cc3cb5a1e7db",
        pass: "061d8389f82b88c6480ec231538f3c90",
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