using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class BlogPostManagementResponse
    {
        public int PostId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public Guid? AuthorId { get; set; }
        public string? AuthorName { get; set; }
        public DateOnly? PostedDate { get; set; }
        public bool? IsActive { get; set; }
    }
} 