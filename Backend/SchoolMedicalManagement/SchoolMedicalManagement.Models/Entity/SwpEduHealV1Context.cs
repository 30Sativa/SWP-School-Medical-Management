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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:schoolhealth.database.windows.net,1433;Initial Catalog=SWP_EduHeal_V1;Persist Security Info=False;User ID=schoolhealth;Password=1234@1234Aa;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA126038D7C2BE44");

            entity.ToTable("BlogPost");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
            entity.Property(e => e.Content).HasColumnType("ntext");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__BlogPost__Author__114A936A");
        });

        modelBuilder.Entity<HandleRecord>(entity =>
        {
            entity.HasKey(e => new { e.EventId, e.SupplyId }).HasName("PK__Handle_R__8E891EB8DFC2B44F");

            entity.ToTable("Handle_Record");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Note).HasMaxLength(255);
            entity.Property(e => e.QuantityUsed).HasDefaultValue(1);

            entity.HasOne(d => d.Event).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Event__151B244E");

            entity.HasOne(d => d.Supply).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.SupplyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Suppl__160F4887");
        });

        modelBuilder.Entity<HealthCheckCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__HealthCh__3F5E8D79C7CF8C27");

            entity.ToTable("HealthCheckCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.HealthCheckCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__HealthChe__Creat__08B54D69");
        });

        modelBuilder.Entity<HealthCheckSummary>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__HealthCh__FBDF78C961DD9422");

            entity.ToTable("HealthCheckSummary");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.BloodPressure).HasMaxLength(50);
            entity.Property(e => e.Bmi)
                .HasMaxLength(10)
                .HasColumnName("BMI");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus).HasMaxLength(20);
            entity.Property(e => e.Ent)
                .HasMaxLength(50)
                .HasColumnName("ENT");
            entity.Property(e => e.EntNotes)
                .HasColumnType("ntext")
                .HasColumnName("ENT_Notes");
            entity.Property(e => e.FollowUpNote).HasColumnType("ntext");
            entity.Property(e => e.GeneralNote).HasColumnType("ntext");
            entity.Property(e => e.HeartRate).HasMaxLength(10);
            entity.Property(e => e.Height).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Mouth).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Throat).HasMaxLength(50);
            entity.Property(e => e.ToothDecay).HasMaxLength(50);
            entity.Property(e => e.ToothNotes).HasColumnType("ntext");
            entity.Property(e => e.VisionSummary).HasColumnType("ntext");
            entity.Property(e => e.Weight).HasMaxLength(10);

            entity.HasOne(d => d.Campaign).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__HealthChe__Campa__0D7A0286");

            entity.HasOne(d => d.Student).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HealthChe__Stude__0C85DE4D");
        });

        modelBuilder.Entity<HealthProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__HealthPr__290C8884D3D5C64D");

            entity.ToTable("HealthProfile");

            entity.HasIndex(e => e.StudentId, "UQ__HealthPr__32C52A78AC22C2AA").IsUnique();

            entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
            entity.Property(e => e.Allergies).HasColumnType("ntext");
            entity.Property(e => e.ChronicDiseases).HasColumnType("ntext");
            entity.Property(e => e.GeneralNote).HasColumnType("ntext");
            entity.Property(e => e.Height).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Weight).HasMaxLength(10);

            entity.HasOne(d => d.Student).WithOne(p => p.HealthProfile)
                .HasForeignKey<HealthProfile>(d => d.StudentId)
                .HasConstraintName("FK__HealthPro__Stude__6B24EA82");
        });

        modelBuilder.Entity<MedicalEvent>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__MedicalE__7944C8700730ED08");

            entity.ToTable("MedicalEvent");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.EventType).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Notes).HasColumnType("ntext");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.HandledByNavigation).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.HandledBy)
                .HasConstraintName("FK__MedicalEv__Handl__76969D2E");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__MedicalEv__Stude__75A278F5");
        });

        modelBuilder.Entity<MedicalSupply>(entity =>
        {
            entity.HasKey(e => e.SupplyId).HasName("PK__MedicalS__7CDD6C8E70FB51EF");

            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        modelBuilder.Entity<MedicationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Medicati__33A8519AF30FB698");

            entity.ToTable("MedicationRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Dosage).HasMaxLength(100);
            entity.Property(e => e.ImagePath).HasMaxLength(255);
            entity.Property(e => e.Instructions).HasColumnType("ntext");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MedicationName).HasMaxLength(100);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Chưa xử lý");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Parent).WithMany(p => p.MedicationRequestParents)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Paren__70DDC3D8");

            entity.HasOne(d => d.ReceivedByNavigation).WithMany(p => p.MedicationRequestReceivedByNavigations)
                .HasForeignKey(d => d.ReceivedBy)
                .HasConstraintName("FK__Medicatio__Recei__71D1E811");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicationRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Stude__6FE99F9F");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3AD768F60F");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__8A2B61609D5F366C").IsUnique();

            entity.Property(e => e.RoleId)
                .ValueGeneratedNever()
                .HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52A79027A0EBA");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Class).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");

            entity.HasOne(d => d.Parent).WithMany(p => p.Students)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Student__ParentI__66603565");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC34A836C4");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E42F569694").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasColumnType("ntext");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsFirstLogin).HasDefaultValue(true);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleID__628FA481");
        });

        modelBuilder.Entity<VaccinationCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__Vaccinat__3F5E8D792079D8AB");

            entity.ToTable("VaccinationCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.Description).HasColumnType("ntext");
            entity.Property(e => e.VaccineName).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccinationCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Vaccinati__Creat__7B5B524B");
        });

        modelBuilder.Entity<VaccinationConsentRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Vaccinat__33A8519A95D344AE");

            entity.ToTable("VaccinationConsentRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Chưa phản hồi");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Campa__00200768");

            entity.HasOne(d => d.Parent).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Paren__01142BA1");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Stude__7F2BE32F");
        });

        modelBuilder.Entity<VaccinationRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__Vaccinat__FBDF78C98A1E2CA8");

            entity.ToTable("VaccinationRecord");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatus).HasMaxLength(20);
            entity.Property(e => e.FollowUpNote).HasColumnType("ntext");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Result).HasColumnType("ntext");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__Vaccinati__Campa__05D8E0BE");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Vaccinati__Stude__04E4BC85");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
