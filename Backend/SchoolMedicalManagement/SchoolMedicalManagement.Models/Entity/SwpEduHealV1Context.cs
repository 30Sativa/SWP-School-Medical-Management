using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SchoolMedicalManagement.Models.Entity;

public partial class SwpEduHealV1Context : DbContext
{
    public SwpEduHealV1Context()
    {
    }

    public SwpEduHealV1Context(DbContextOptions<SwpEduHealV1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<HandleRecord> HandleRecords { get; set; }

    public virtual DbSet<HealthCheckCampaign> HealthCheckCampaigns { get; set; }

    public virtual DbSet<HealthCheckSummary> HealthCheckSummaries { get; set; }

    public virtual DbSet<HealthProfile> HealthProfiles { get; set; }

    public virtual DbSet<MedicalEvent> MedicalEvents { get; set; }

    public virtual DbSet<MedicalSupply> MedicalSupplies { get; set; }

    public virtual DbSet<MedicationRequest> MedicationRequests { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VaccinationCampaign> VaccinationCampaigns { get; set; }

    public virtual DbSet<VaccinationConsentRequest> VaccinationConsentRequests { get; set; }

    public virtual DbSet<VaccinationRecord> VaccinationRecords { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-C4ONNIO\\SQLEXPRESS;Database=SWP_EduHeal_V1;User Id=sa;Password=12345;TrustServerCertificate=true;Trusted_Connection=SSPI;Encrypt=false;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA12603853A397F9");

            entity.ToTable("BlogPost");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__BlogPost__Author__6477ECF3");
        });

        modelBuilder.Entity<HandleRecord>(entity =>
        {
            entity.HasKey(e => new { e.EventId, e.SupplyId }).HasName("PK__Handle_R__8E891EB8B4C5644A");

            entity.ToTable("Handle_Record");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Note)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.QuantityUsed).HasDefaultValue(1);

            entity.HasOne(d => d.Event).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Event__68487DD7");

            entity.HasOne(d => d.Supply).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.SupplyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Suppl__693CA210");
        });

        modelBuilder.Entity<HealthCheckCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__HealthCh__3F5E8D7950C453A4");

            entity.ToTable("HealthCheckCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.HealthCheckCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__HealthChe__Creat__5DCAEF64");
        });

        modelBuilder.Entity<HealthCheckSummary>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__HealthCh__FBDF78C97976A963");

            entity.ToTable("HealthCheckSummary");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.BloodPressure)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Bmi)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("BMI");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Ent)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ENT");
            entity.Property(e => e.EntNotes)
                .HasColumnType("text")
                .HasColumnName("ENT_Notes");
            entity.Property(e => e.FollowUpNote).HasColumnType("text");
            entity.Property(e => e.GeneralNote).HasColumnType("text");
            entity.Property(e => e.HeartRate)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Height)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Mouth)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Throat)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ToothDecay)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ToothNotes).HasColumnType("text");
            entity.Property(e => e.VisionSummary).HasColumnType("text");
            entity.Property(e => e.Weight)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Campaign).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__HealthChe__Campa__619B8048");

            entity.HasOne(d => d.Student).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HealthChe__Stude__60A75C0F");
        });

        modelBuilder.Entity<HealthProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__HealthPr__290C8884CD7B3D09");

            entity.ToTable("HealthProfile");

            entity.HasIndex(e => e.StudentId, "UQ__HealthPr__32C52A78687F2374").IsUnique();

            entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
            entity.Property(e => e.Allergies).HasColumnType("text");
            entity.Property(e => e.ChronicDiseases).HasColumnType("text");
            entity.Property(e => e.GeneralNote).HasColumnType("text");
            entity.Property(e => e.Height)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Weight)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Student).WithOne(p => p.HealthProfile)
                .HasForeignKey<HealthProfile>(d => d.StudentId)
                .HasConstraintName("FK__HealthPro__Stude__4316F928");
        });

        modelBuilder.Entity<MedicalEvent>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__MedicalE__7944C87066E3F64A");

            entity.ToTable("MedicalEvent");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.EventType)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Notes).HasColumnType("text");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.HandledByNavigation).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.HandledBy)
                .HasConstraintName("FK__MedicalEv__Handl__4CA06362");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__MedicalEv__Stude__4BAC3F29");
        });

        modelBuilder.Entity<MedicalSupply>(entity =>
        {
            entity.HasKey(e => e.SupplyId).HasName("PK__MedicalS__7CDD6C8E1D47410E");

            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MedicationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Medicati__33A8519A1C457C72");

            entity.ToTable("MedicationRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Dosage)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ImagePath)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Instructions).HasColumnType("text");
            entity.Property(e => e.MedicationName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Chua x? lý");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Parent).WithMany(p => p.MedicationRequestParents)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Paren__47DBAE45");

            entity.HasOne(d => d.ReceivedByNavigation).WithMany(p => p.MedicationRequestReceivedByNavigations)
                .HasForeignKey(d => d.ReceivedBy)
                .HasConstraintName("FK_MedicationRequest_ReceivedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicationRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Stude__46E78A0C");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3AF7D4923D");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__8A2B616062011634").IsUnique();

            entity.Property(e => e.RoleId)
                .ValueGeneratedNever()
                .HasColumnName("RoleID");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52A79BFD45512");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Class)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");

            entity.HasOne(d => d.Parent).WithMany(p => p.Students)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Student__ParentI__3F466844");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC361955C8");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4320923A2").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasColumnType("text");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IsFirstLogin).HasDefaultValue(true);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleID__3C69FB99");
        });

        modelBuilder.Entity<VaccinationCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__Vaccinat__3F5E8D79B5133216");

            entity.ToTable("VaccinationCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.VaccineName)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccinationCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Vaccinati__Creat__5165187F");
        });

        modelBuilder.Entity<VaccinationConsentRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Vaccinat__33A8519AB12CB0AD");

            entity.ToTable("VaccinationConsentRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Chua ph?n h?i");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Campa__5629CD9C");

            entity.HasOne(d => d.Parent).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Paren__571DF1D5");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Stude__5535A963");
        });

        modelBuilder.Entity<VaccinationRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__Vaccinat__FBDF78C9351AF9A0");

            entity.ToTable("VaccinationRecord");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FollowUpNote).HasColumnType("text");
            entity.Property(e => e.Result).HasColumnType("text");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__Vaccinati__Campa__5AEE82B9");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Vaccinati__Stude__59FA5E80");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
