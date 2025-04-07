import { Inject, Injectable } from '@nestjs/common';
import { MAIL_PROVIDER } from './mail.constants';
import { MailProvider } from './interfaces/mail-provider.interface';
import { getEmailTemplate } from './templates/email-template';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: MailProvider,
  ) {}

  async sendUserWelcome(to: string, userName: string) {
    const subject = 'Bem-vindo ao TrackFinan!';
    const content = `
      <p>Olá <strong>${userName}</strong>,</p>
      <p>Bem-vindo à nossa plataforma de controle financeiro!</p>
      <p>Estamos muito felizes em tê-lo conosco. Com o TrackFinance, você poderá:</p>
      <ul>
        <li>Controlar suas receitas e despesas</li>
        <li>Acompanhar seu saldo em tempo real</li>
        <li>Gerar relatórios financeiros</li>
        <li>Categorizar suas transações</li>
      </ul>
      <p>Se precisar de ajuda, não hesite em entrar em contato conosco.</p>
      <p>Atenciosamente,<br>Equipe TrackFinance</p>
    `;
    
    const htmlBody = getEmailTemplate('Bem-vindo ao TrackFinan', content);
    await this.mailProvider.sendMail(to, subject, htmlBody);
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const subject = 'Redefinição de Senha - TrackFinan';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const content = `
      <p>Você solicitou a redefinição de sua senha.</p>
      <p>Para criar uma nova senha, clique no botão abaixo:</p>
      <a href="${resetUrl}" class="button">Redefinir Senha</a>
      <p>Se você não solicitou esta redefinição, ignore este email.</p>
      <p>Este link expira em 1 hora.</p>
    `;
    
    const htmlBody = getEmailTemplate('Redefinição de Senha', content);
    await this.mailProvider.sendMail(to, subject, htmlBody);
  }

  async sendMonthlyReport(to: string, reportData: any) {
    const subject = 'Relatório Mensal - TrackFinan';
    
    const content = `
      <p>Seu relatório mensal está disponível:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Receitas:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; color: green;">R$ ${reportData.income}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Despesas:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; color: red;">R$ ${reportData.expense}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Saldo:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; color: ${reportData.balance >= 0 ? 'green' : 'red'};">R$ ${reportData.balance}</td>
        </tr>
      </table>
      <p>Acesse sua conta para ver mais detalhes.</p>
    `;
    
    const htmlBody = getEmailTemplate('Relatório Mensal', content);
    await this.mailProvider.sendMail(to, subject, htmlBody);
  }
}