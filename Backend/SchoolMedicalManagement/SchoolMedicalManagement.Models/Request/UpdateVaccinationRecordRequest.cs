namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateVaccinationRecordRequest
    {
        public int RecordId { get; set; }
        public DateTime? VaccinationDate { get; set; }
        public string? Result { get; set; }
        public string? FollowUpNote { get; set; }
        public bool? IsActive { get; set; }
    }
} 