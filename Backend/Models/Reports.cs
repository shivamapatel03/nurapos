namespace Nurapos.Models;

public sealed class SalesTaxReport
{
    public DateOnly From { get; init; }
    public DateOnly To { get; init; }
    public IReadOnlyList<TaxSlabBreakdown> SalesByRate { get; init; } = [];
    public IReadOnlyList<TaxSlabBreakdown> PurchasesByRate { get; init; } = [];
}

public sealed class TaxSlabBreakdown
{
    public decimal TaxRate { get; init; }
    public decimal TaxableAmount { get; init; }
    public decimal TaxAmount { get; init; }
}

public sealed class ProfitLossReport
{
    public decimal GrossSales { get; init; }
    public decimal DiscountsAndRefunds { get; init; }
    public decimal NetSales { get; init; }
    public decimal CostOfGoodsSold { get; init; }
    public decimal OperatingExpenses { get; init; }
    public decimal NetOperatingProfit { get; init; }
    public bool CostOfGoodsSoldUsesCurrentProductCost { get; init; }
}

public sealed class ZReportRecord
{
    public string ShiftId { get; init; } = string.Empty;
    public string TerminalId { get; init; } = string.Empty;
    public int CashierId { get; init; }
    public DateTime OpenedAtUtc { get; init; }
    public DateTime? ClosedAtUtc { get; init; }
    public string Status { get; init; } = string.Empty;
    public decimal OpeningFloat { get; init; }
    public decimal? ExpectedCash { get; init; }
    public decimal? ActualCash { get; init; }
    public decimal? CashDifference { get; init; }
    public decimal TotalSales { get; init; }
    public decimal CashTotal { get; init; }
    public decimal CardTotal { get; init; }
    public decimal UpiTotal { get; init; }
}

public sealed class InventoryValuationReport
{
    public decimal TotalValue { get; init; }
    public int LowStockItems { get; init; }
    public IReadOnlyList<InventoryValuationLine> Items { get; init; } = [];
}

public sealed class InventoryValuationLine
{
    public int ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public decimal Quantity { get; init; }
    public decimal CostPrice { get; init; }
    public decimal Value { get; init; }
    public decimal ReorderLevel { get; init; }
    public bool IsLowStock { get; init; }
}
