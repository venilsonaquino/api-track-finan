export interface MailProvider {
  sendMail(
    to: string,
    subject: string,
    text: string,
    fromName?: string,
    fromEmail?: string
  ): Promise<void>;

  sendMailWithTemplate(
    to: string,
    subject: string,
    template: string,
    context: any
  ): Promise<void>;
}
