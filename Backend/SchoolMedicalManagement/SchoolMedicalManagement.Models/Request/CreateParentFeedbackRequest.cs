using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateParentFeedbackRequest
    {
        public Guid ParentId { get; set; }
        public string? RelatedType { get; set; }
        public int? RelatedId { get; set; }
        public string? Content { get; set; }
        public int? Rating { get; set; }
    }
} 