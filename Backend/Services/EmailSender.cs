using System.Net;
using System.Net.Mail;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class EmailSender(IConfiguration configuration) : IEmailSender
{
    public async Task SendAsync(string recipient, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var host = configuration["Mail:Host"];
        var from = configuration["Mail:FromAddress"];
        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(from))
            throw new InvalidOperationException("Mail:Host and Mail:FromAddress must be configured to send account emails.");

        var port = configuration.GetValue("Mail:Port", 587);
        using var client = new SmtpClient(host, port)
        {
            EnableSsl = configuration.GetValue("Mail:UseStartTls", true),
            DeliveryMethod = SmtpDeliveryMethod.Network
        };
        var username = configuration["Mail:Username"];
        var password = configuration["Mail:Password"];
        if (string.IsNullOrWhiteSpace(username) != string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Mail:Username and Mail:Password must both be configured when SMTP authentication is used.");
        if (!string.IsNullOrEmpty(username)) client.Credentials = new NetworkCredential(username, password);

        using var message = new MailMessage(from, recipient, subject, htmlBody) { IsBodyHtml = true };
        cancellationToken.ThrowIfCancellationRequested();
        await client.SendMailAsync(message, cancellationToken);
    }
}
