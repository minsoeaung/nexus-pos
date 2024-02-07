using Backend.Configs;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Backend.Services;

public class EmailSender(IOptions<MailConfig> mailConfig) : IEmailSender
{
    private readonly MailConfig _mailConfig = mailConfig.Value;

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var mimeMessage = new MimeMessage();

        mimeMessage.Sender = MailboxAddress.Parse(_mailConfig.Mail);
        mimeMessage.To.Add(MailboxAddress.Parse(email));
        mimeMessage.Subject = subject;

        var builder = new BodyBuilder
        {
            HtmlBody = htmlMessage
        };
        mimeMessage.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_mailConfig.Host, _mailConfig.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_mailConfig.Mail, _mailConfig.Password);
        await smtp.SendAsync(mimeMessage);
        await smtp.DisconnectAsync(true);
    }
}