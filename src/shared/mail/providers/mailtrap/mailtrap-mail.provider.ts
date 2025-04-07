import { Injectable, Logger } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';
import { MailProvider } from '../../interfaces/mail-provider.interface';

@Injectable()
export class MailtrapMailProvider implements MailProvider {
  private client: MailtrapClient;
  private readonly senderEmail = process.env.MAILTRAP_SENDER_EMAIL!;
  private readonly token = "061d8389f82b88c6480ec231538f3c90";
  private readonly logger = new Logger(MailtrapMailProvider.name);

  constructor() {
    if (!this.token) {
      this.logger.error('MAILTRAP_TOKEN não está definido');
      throw new Error('MAILTRAP_TOKEN não está definido');
    }
    
    if (!this.senderEmail) {
      this.logger.error('MAILTRAP_SENDER_EMAIL não está definido');
      throw new Error('MAILTRAP_SENDER_EMAIL não está definido');
    }
    
    this.client = new MailtrapClient({ token: this.token, testInboxId: 1470287 });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    fromName = 'TrackFinance',
    fromEmail = this.senderEmail,
  ): Promise<void> {
    try {
      const sender = { name: fromName, email: fromEmail };
      
      // Verifica se o texto contém HTML
      const isHtml = text.includes('<html') || text.includes('<body') || text.includes('<div');
      
      const mailOptions: any = {
        from: sender,
        to: [{ email: to }],
        subject,
      };
      
      if (isHtml) {
        mailOptions.html = text;
      } else {
        mailOptions.text = text;
      }

      await this.client.send(mailOptions);
      this.logger.log(`Email enviado para ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}