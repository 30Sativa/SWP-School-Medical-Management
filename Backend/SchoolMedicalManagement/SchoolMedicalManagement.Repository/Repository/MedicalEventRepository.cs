using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Repository.Repository;

public class MedicalEventRepository : GenericRepository<MedicalEvent>
{
    public MedicalEventRepository(SwpEduHealV5Context context) : base(context) { }

    // Load đầy đủ dữ liệu liên quan: Student, Parent, Supplies
    public async Task<MedicalEvent?> GetMedicalEventById(int id) =>
        await _context.MedicalEvents
            .Include(e => e.Student).ThenInclude(s => s.Parent)
            .Include(e => e.HandledByNavigation)
            .Include(e => e.EventType)
            .Include(e => e.Severity)
            .Include(e => e.HandleRecords).ThenInclude(hr => hr.Supply)
            .Include(e => e.Student.MedicalHistories)
            .FirstOrDefaultAsync(e => e.EventId == id && e.IsActive == true);

    // Đề xuất: lọc IsActive == true để tránh load những sự kiện đã xoá mềm
    public async Task<List<MedicalEvent>> GetAllMedicalEvents() =>
        await _context.MedicalEvents
            .Where(e => e.IsActive != false)
            .Include(e => e.Student)
                .ThenInclude(pr => pr.Parent)
            .Include(e => e.HandledByNavigation)
            .Include(e => e.EventType)
            .Include(e => e.Severity)
            .Include(e => e.HandleRecords)
                .ThenInclude(hr => hr.Supply)
            .Include(e => e.Student.MedicalHistories)
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

    // Lấy thông tin chi tiết của vật tư y tế theo ID
    public async Task<MedicalSupply?> GetSupplyById(int supplyId)
    {
        return await _context.MedicalSupplies.FindAsync(supplyId);
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
    //public async Task<IDbContextTransaction> BeginTransactionAsync()
    //{
    //    return await _context.Database.BeginTransactionAsync();
    //}

    // Xoá toàn bộ handle record nếu cần cập nhật SuppliesUsed
    public async Task RemoveHandleRecordsAsync(IEnumerable<HandleRecord> records)
    {
        _context.HandleRecords.RemoveRange(records);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AdjustSupplyQuantity(int supplyId, int quantityDelta)
    {
        var supply = await _context.MedicalSupplies.FindAsync(supplyId);
        if (supply == null) return false;

        var newQuantity = supply.Quantity - quantityDelta;
        if (newQuantity < 0) return false;

        supply.Quantity = newQuantity;
        _context.MedicalSupplies.Update(supply);
        await _context.SaveChangesAsync();
        return true;
    }



    //
    public async Task<MedicalEvent?> GetMedicalEventByStudentID(int studentID)
    {
        return await _context.MedicalEvents
            .Include(e => e.Student)
                .ThenInclude(pr => pr.Parent)
            .Include(e => e.HandledByNavigation)
            .Include(e => e.EventType)
            .Include(e => e.Severity)
            .Include(e => e.HandleRecords)
                .ThenInclude(hr => hr.Supply)
            .Include(e => e.Student.MedicalHistories)
            .FirstOrDefaultAsync(p => p.StudentId == studentID && p.IsActive == true);
    }
}
