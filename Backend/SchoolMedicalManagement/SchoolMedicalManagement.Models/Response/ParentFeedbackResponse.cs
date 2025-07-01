using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class ParentFeedbackResponse
    {
        public int FeedbackId { get; set; }
        public Guid? ParentId { get; set; }
        public string? ParentName { get; set; }
        public string? RelatedType { get; set; }
        public int? RelatedId { get; set; }
        public string? Content { get; set; }
        public int? Rating { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
} 