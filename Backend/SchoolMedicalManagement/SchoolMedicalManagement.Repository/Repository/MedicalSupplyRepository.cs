using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class MedicalSupplyRepository : GenericRepository<MedicalSupply>
    {
        public MedicalSupplyRepository(SwpEduHealV1Context context) : base(context)
        {
        }

        public async Task<List<MedicalSupply>> GetAllMedicalSupply()
        {
            return await _context.MedicalSupplies.ToListAsync();
        }

        public async Task<MedicalSupply?> GetByIdMedicalSupply(int id)
        {
            return await _context.MedicalSupplies
                .FirstOrDefaultAsync(s => s.SupplyId == id);
        }

        public async Task<MedicalSupply?> CreateMedicalSupply(MedicalSupply medicalSupply)
        {
            await CreateAsync(medicalSupply);
            return await GetByIdMedicalSupply(medicalSupply.SupplyId);
        }

        public async Task<MedicalSupply?> UpdateMedicalSupply(MedicalSupply medicalSupply)
        {
            await UpdateAsync(medicalSupply);
            return await GetByIdMedicalSupply(medicalSupply.SupplyId);
        }

        //xoá mềm // fix database thiếu xoá mềm
        //public async Task<int?> DeleteMedicalSupply(int id)
        //{
        //    var IsExist = await GetByIdMedicalSupply(id);
        //    if (IsExist == null) return 0;

        //    IsExist.IsActive = false;
        //    return await UpdateAsync(IsExist);
        //}

    }
}
