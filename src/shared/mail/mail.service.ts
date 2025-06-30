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

    const context = {
      userName,
      features: [
        'Controlar suas receitas e despesas',
        'Acompanhar seu saldo em tempo real',
        'Gerar relatórios financeiros',
        'Categorizar suas transações',
      ],
    };

    await this.mailProvider.sendMailWithTemplate(
      to,
      subject,
      'welcome',
      context,
    );
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
