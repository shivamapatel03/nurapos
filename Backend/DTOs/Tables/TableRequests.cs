using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Tables;

public sealed class CreateTableRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Required, StringLength(24)] public string TableNumber { get; set; } = string.Empty;
    [Required, StringLength(80)] public string Section { get; set; } = string.Empty;
    [Range(1, 100)] public int Capacity { get; set; }
}

public sealed class UpdateTableStatusRequest
{
    [Required, RegularExpression(@"^(VACANT|OCCUPIED|RESERVED|BILLED)$")] public string Status { get; set; } = string.Empty;
    [StringLength(64)] public string? ActiveOrderId { get; set; }
}

public sealed class TransferTableRequest
{
    [Range(1, int.MaxValue)] public int TargetTableId { get; set; }
}
