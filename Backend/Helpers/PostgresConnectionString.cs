using Npgsql;

namespace Nurapos.Helpers;

public static class PostgresConnectionString
{
    public static string Normalize(string connectionString)
    {
        if (!Uri.TryCreate(connectionString, UriKind.Absolute, out var uri) ||
            (uri.Scheme != "postgres" && uri.Scheme != "postgresql"))
        {
            return connectionString;
        }

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/')),
            SslMode = SslMode.Require
        };

        var credentials = uri.UserInfo.Split(':', 2);
        if (credentials.Length > 0 && credentials[0].Length > 0)
        {
            builder.Username = Uri.UnescapeDataString(credentials[0]);
        }

        if (credentials.Length > 1)
        {
            builder.Password = Uri.UnescapeDataString(credentials[1]);
        }

        foreach (var item in uri.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var pair = item.Split('=', 2);
            var key = Uri.UnescapeDataString(pair[0].Replace('+', ' ')).ToLowerInvariant();
            var value = pair.Length > 1
                ? Uri.UnescapeDataString(pair[1].Replace('+', ' '))
                : string.Empty;

            switch (key)
            {
                case "sslmode" when value.Length > 0:
                    builder.SslMode = Enum.Parse<SslMode>(value.Replace("-", string.Empty), ignoreCase: true);
                    break;
                case "pooling" when bool.TryParse(value, out var pooling):
                    builder.Pooling = pooling;
                    break;
                case "timeout" when int.TryParse(value, out var timeout):
                    builder.Timeout = timeout;
                    break;
                case "command_timeout" when int.TryParse(value, out var commandTimeout):
                    builder.CommandTimeout = commandTimeout;
                    break;
                case "application_name":
                    builder.ApplicationName = value;
                    break;
            }
        }

        return builder.ConnectionString;
    }
}
