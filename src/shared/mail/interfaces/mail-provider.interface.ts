export interface MailProvider {
  sendMail(
    to: string,
    subject: string,
    text: string,
    fromName?: string,
    fromEmail?: string
  ): Promise<void>;
}
