using Npgsql;
using NpgsqlTypes;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class OfferRepository(NpgsqlConnection connection) : IOfferRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql="""
            CREATE TABLE IF NOT EXISTS t_offer(
                c_offer_id SERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_title VARCHAR(120) NOT NULL,
                c_code VARCHAR(32) NOT NULL,
                c_discount_type VARCHAR(20) NOT NULL CHECK(c_discount_type IN ('percentage','fixed_amount','promo_price')),
                c_discount_value NUMERIC(14,2) NOT NULL CHECK(c_discount_value>0),
                c_applies_to VARCHAR(16) NOT NULL CHECK(c_applies_to IN ('all','category','product')),
                c_target_ids INT[] NOT NULL DEFAULT '{}',
                c_min_subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_start_date DATE NOT NULL,
                c_end_date DATE NOT NULL,
                c_is_active BOOLEAN NOT NULL DEFAULT TRUE,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_offer_franchise_code UNIQUE(c_franchise_id,c_code),
                CONSTRAINT chk_offer_dates CHECK(c_end_date>=c_start_date)
            );
            """;
        await OpenAsync(); await using var cmd=new NpgsqlCommand(sql,connection); await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IReadOnlyList<Offer>> GetAllAsync(int ownerId,int franchiseId)
    {
        const string sql="""
            SELECT o.c_offer_id,o.c_user_id,o.c_franchise_id,o.c_title,o.c_code,o.c_discount_type,o.c_discount_value,
                   o.c_applies_to,o.c_target_ids,o.c_min_subtotal,o.c_start_date,o.c_end_date,o.c_is_active
            FROM t_offer o JOIN t_franchise f ON f.c_franchise_id=o.c_franchise_id
            WHERE f.c_user_id=@owner AND o.c_franchise_id=@franchise AND o.c_is_active
              AND CURRENT_DATE BETWEEN o.c_start_date AND o.c_end_date ORDER BY o.c_start_date DESC;
            """;
        await OpenAsync(); await using var cmd=new NpgsqlCommand(sql,connection); cmd.Parameters.AddWithValue("@owner",ownerId); cmd.Parameters.AddWithValue("@franchise",franchiseId);
        await using var r=await cmd.ExecuteReaderAsync(); var offers=new List<Offer>(); while(await r.ReadAsync()) offers.Add(Map(r)); return offers;
    }

    public async Task<Offer> CreateAsync(Offer offer)
    {
        const string sql="""
            INSERT INTO t_offer(c_user_id,c_franchise_id,c_title,c_code,c_discount_type,c_discount_value,c_applies_to,c_target_ids,c_min_subtotal,c_start_date,c_end_date,c_is_active)
            SELECT @owner,@franchise,@title,@code,@type,@value,@applies,@targets,@minimum,@start,@end,@active
            WHERE EXISTS(SELECT 1 FROM t_franchise WHERE c_franchise_id=@franchise AND c_user_id=@owner)
            RETURNING c_offer_id;
            """;
        await OpenAsync(); await using var cmd=new NpgsqlCommand(sql,connection); AddParameters(cmd,offer); var id=await cmd.ExecuteScalarAsync();
        if(id is null) throw new KeyNotFoundException("Franchise not found."); offer.Id=Convert.ToInt32(id); return offer;
    }

    public async Task<Offer?> GetByCodeAsync(int ownerId,int franchiseId,string code)
    {
        const string sql="""
            SELECT o.c_offer_id,o.c_user_id,o.c_franchise_id,o.c_title,o.c_code,o.c_discount_type,o.c_discount_value,
                   o.c_applies_to,o.c_target_ids,o.c_min_subtotal,o.c_start_date,o.c_end_date,o.c_is_active
            FROM t_offer o JOIN t_franchise f ON f.c_franchise_id=o.c_franchise_id
            WHERE f.c_user_id=@owner AND o.c_franchise_id=@franchise AND UPPER(o.c_code)=UPPER(@code)
              AND o.c_is_active AND CURRENT_DATE BETWEEN o.c_start_date AND o.c_end_date LIMIT 1;
            """;
        await OpenAsync(); await using var cmd=new NpgsqlCommand(sql,connection); cmd.Parameters.AddWithValue("@owner",ownerId);cmd.Parameters.AddWithValue("@franchise",franchiseId);cmd.Parameters.AddWithValue("@code",code);
        await using var r=await cmd.ExecuteReaderAsync(); return await r.ReadAsync()?Map(r):null;
    }

    private static void AddParameters(NpgsqlCommand c,Offer o)
    {
        c.Parameters.AddWithValue("@owner",o.OwnerId);c.Parameters.AddWithValue("@franchise",o.FranchiseId);c.Parameters.AddWithValue("@title",o.Title);
        c.Parameters.AddWithValue("@code",o.Code);c.Parameters.AddWithValue("@type",o.DiscountType);c.Parameters.AddWithValue("@value",o.DiscountValue);
        c.Parameters.AddWithValue("@applies",o.AppliesTo);c.Parameters.Add(new NpgsqlParameter("@targets",NpgsqlDbType.Array|NpgsqlDbType.Integer){Value=o.TargetIds});
        c.Parameters.AddWithValue("@minimum",o.MinSubtotal);c.Parameters.AddWithValue("@start",o.StartDate);c.Parameters.AddWithValue("@end",o.EndDate);c.Parameters.AddWithValue("@active",o.IsActive);
    }
    private async Task OpenAsync(){if(connection.State!=System.Data.ConnectionState.Open)await connection.OpenAsync();}
    private static Offer Map(NpgsqlDataReader r)=>new(){Id=r.GetInt32(0),OwnerId=r.GetInt32(1),FranchiseId=r.GetInt32(2),Title=r.GetString(3),Code=r.GetString(4),DiscountType=r.GetString(5),DiscountValue=r.GetDecimal(6),AppliesTo=r.GetString(7),TargetIds=r.GetFieldValue<int[]>(8),MinSubtotal=r.GetDecimal(9),StartDate=r.GetFieldValue<DateOnly>(10),EndDate=r.GetFieldValue<DateOnly>(11),IsActive=r.GetBoolean(12)};
}
