using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Repository.Repository;

public class MedicalEventRepository : GenericRepository<MedicalEvent>
{
    public MedicalEventRepository(SwpEduHealV1Context context) : base(context) { }

    // Load đầy đủ dữ liệu liên quan: Student, Parent, Supplies
    public async Task<MedicalEvent?> GetMedicalEventById(int id) =>
        await _context.MedicalEvents
            .Include(e => e.Student)
                .ThenInclude(s => s.Parent)
            .Include(e => e.HandledByNavigation)
            .Include(e => e.HandleRecords)
                .ThenInclude(hr => hr.Supply)
            .FirstOrDefaultAsync(e => e.EventId == id);

    // Đề xuất: lọc IsActive == true để tránh load những sự kiện đã xoá mềm
    public async Task<List<MedicalEvent>> GetAllMedicalEvents() =>
        await _context.MedicalEvents
            .Where(e => e.IsActive != false)
            .Include(e => e.Student)
                .ThenInclude(pr => pr.Parent)
            .Include(e => e.HandledByNavigation)
            .Include(e => e.HandleRecords)
                .ThenInclude(hr => hr.Supply)
            .ToListAsync();

    // Tạo và trả về bản ghi đã tạo với đầy đủ liên kết
    public async Task<MedicalEvent?> CreateMedicalEvent(MedicalEvent medicalEvent)
    {
        await CreateAsync(medicalEvent);
        return await GetMedicalEventById(medicalEvent.EventId);
    }

    // Cập nhật và trả về bản ghi đã cập nhật
    public async Task<MedicalEvent?> UpdateMedicalEvent(MedicalEvent medicalEvent)
    {
        await UpdateAsync(medicalEvent);
        return await GetMedicalEventById(medicalEvent.EventId);
    }

    // Soft Delete: Không xoá vật lý mà set IsActive = false
    public async Task<int?> DeleteMedicalEvent(int id)
    {
        var IsExist = await GetMedicalEventById(id);
        if (IsExist == null) return 0;

        IsExist.IsActive = false;
        return await UpdateAsync(IsExist);
    }

    // Kiểm tra tồn kho trước khi dùng vật tư
    public async Task<bool> IsSupplyEnough(int supplyId, int quantityRequired)
    {
        var supply = await _context.MedicalSupplies.FindAsync(supplyId);
        return supply != null && supply.Quantity >= quantityRequired;
    }

    // Cập nhật số lượng tồn kho sau khi dùng vật tư
    public async Task<bool> UpdateSupplyQuantity(int supplyId, int quantityUsed)
    {
        var supply = await _context.MedicalSupplies.FindAsync(supplyId);
        if (supply == null || supply.Quantity < quantityUsed) return false;

        supply.Quantity -= quantityUsed;
        _context.MedicalSupplies.Update(supply);
        await _context.SaveChangesAsync();
        return true;
    }

    // Ghi nhận vật tư đã sử dụng
    public async Task AddHandleRecordsAsync(List<HandleRecord> handleRecords)
    {
        await _context.HandleRecords.AddRangeAsync(handleRecords);
        await _context.SaveChangesAsync();
    }

    // Bắt đầu giao dịch DB nếu cần rollback nhiều thao tác
    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        return await _context.Database.BeginTransactionAsync();
    }

    // Xoá toàn bộ handle record nếu cần cập nhật SuppliesUsed
    public async Task RemoveHandleRecordsAsync(IEnumerable<HandleRecord> records)
    {
        _context.HandleRecords.RemoveRange(records);
        await _context.SaveChangesAsync();
    }
}
