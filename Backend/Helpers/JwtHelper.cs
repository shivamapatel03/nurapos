using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Nurapos.Helpers;

public interface IJwtHelper
{
    GeneratedAccessToken GenerateToken(int userId, string email, string role, bool posPinVerified = false);
}

public sealed record GeneratedAccessToken(string Token, DateTime ExpiresAtUtc);

public class JwtHelper : IJwtHelper
{
    private readonly IConfiguration _config;

    public JwtHelper(IConfiguration config)
    {
        _config = config;
    }

    public GeneratedAccessToken GenerateToken(int userId, string email, string role, bool posPinVerified = false)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing.");
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        if (posPinVerified)
        {
            claims.Add(new Claim("pos_pin_verified", "true"));
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expiresAtUtc = DateTime.UtcNow.AddMinutes(
            _config.GetValue("Jwt:ExpiryMinutes", 15));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: credentials
        );

        return new GeneratedAccessToken(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAtUtc);
    }
}
