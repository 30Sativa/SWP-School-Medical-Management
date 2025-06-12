using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SchoolMedicalManagement.Models.Entity;

public partial class SwpEduHealV5Context : DbContext
{
    public SwpEduHealV5Context()
    {
    }

    public SwpEduHealV5Context(DbContextOptions<SwpEduHealV5Context> options)
        : base(options)
    {
    }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<ConsentStatusType> ConsentStatusTypes { get; set; }

    public virtual DbSet<GenderType> GenderTypes { get; set; }

    public virtual DbSet<HandleRecord> HandleRecords { get; set; }

    public virtual DbSet<HealthCheckCampaign> HealthCheckCampaigns { get; set; }

    public virtual DbSet<HealthCheckSummary> HealthCheckSummaries { get; set; }

    public virtual DbSet<HealthProfile> HealthProfiles { get; set; }

    public virtual DbSet<MedicalEvent> MedicalEvents { get; set; }

    public virtual DbSet<MedicalEventType> MedicalEventTypes { get; set; }

    public virtual DbSet<MedicalHistory> MedicalHistories { get; set; }

    public virtual DbSet<MedicalSupply> MedicalSupplies { get; set; }

    public virtual DbSet<MedicationRequest> MedicationRequests { get; set; }

    public virtual DbSet<MedicationRequestStatus> MedicationRequestStatuses { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<NotificationType> NotificationTypes { get; set; }

    public virtual DbSet<ParentFeedback> ParentFeedbacks { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SeverityLevel> SeverityLevels { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VaccinationCampaign> VaccinationCampaigns { get; set; }

    public virtual DbSet<VaccinationConsentRequest> VaccinationConsentRequests { get; set; }

    public virtual DbSet<VaccinationRecord> VaccinationRecords { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=20.92.224.160,1433;Database=SWP_EduHeal_V5;User Id=sa;Password=12345;TrustServerCertificate=true;Trusted_Connection=SSPI;Encrypt=false;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__AuditLog__5E5499A8D9A3D87B");

            entity.ToTable("AuditLog");

            entity.Property(e => e.LogId).HasColumnName("LogID");
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.ActionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.TargetId).HasColumnName("TargetID");
            entity.Property(e => e.TargetTable).HasMaxLength(100);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__AuditLog__UserID__17036CC0");
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA126038970F7A4C");

            entity.ToTable("BlogPost");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__BlogPost__Author__0D7A0286");
        });

        modelBuilder.Entity<ConsentStatusType>(entity =>
        {
            entity.HasKey(e => e.ConsentStatusId).HasName("PK__ConsentS__D91383D6633A4114");

            entity.ToTable("ConsentStatusType");

            entity.HasIndex(e => e.ConsentStatusName, "UQ__ConsentS__98BB55AEEE6D9279").IsUnique();

            entity.Property(e => e.ConsentStatusId).HasColumnName("ConsentStatusID");
            entity.Property(e => e.ConsentStatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<GenderType>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("PK__GenderTy__4E24E817974978C5");

            entity.ToTable("GenderType");

            entity.HasIndex(e => e.GenderName, "UQ__GenderTy__F7C17715D17A8559").IsUnique();

            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.GenderName).HasMaxLength(20);
        });

        modelBuilder.Entity<HandleRecord>(entity =>
        {
            entity.HasKey(e => new { e.EventId, e.SupplyId }).HasName("PK__Handle_R__8E891EB8192DC8D2");

            entity.ToTable("Handle_Record");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Note).HasMaxLength(255);
            entity.Property(e => e.QuantityUsed).HasDefaultValue(1);

            entity.HasOne(d => d.Event).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Event__71D1E811");

            entity.HasOne(d => d.Supply).WithMany(p => p.HandleRecords)
                .HasForeignKey(d => d.SupplyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Handle_Re__Suppl__72C60C4A");
        });

        modelBuilder.Entity<HealthCheckCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__HealthCh__3F5E8D79D4EC74F7");

            entity.ToTable("HealthCheckCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.HealthCheckCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__HealthChe__Creat__03F0984C");
        });

        modelBuilder.Entity<HealthCheckSummary>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__HealthCh__FBDF78C9E21C1FCD");

            entity.ToTable("HealthCheckSummary");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.BloodPressure).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Bmi)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("BMI");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentStatusId).HasColumnName("ConsentStatusID");
            entity.Property(e => e.Ent)
                .HasMaxLength(50)
                .HasColumnName("ENT");
            entity.Property(e => e.EntNotes).HasColumnName("ENT_Notes");
            entity.Property(e => e.Height).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Mouth).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Throat).HasMaxLength(50);
            entity.Property(e => e.ToothDecay).HasMaxLength(50);
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Campaign).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__HealthChe__Campa__08B54D69");

            entity.HasOne(d => d.ConsentStatus).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.ConsentStatusId)
                .HasConstraintName("FK__HealthChe__Conse__09A971A2");

            entity.HasOne(d => d.Student).WithMany(p => p.HealthCheckSummaries)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HealthChe__Stude__07C12930");
        });

        modelBuilder.Entity<HealthProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__HealthPr__290C88845AF97112");

            entity.ToTable("HealthProfile");

            entity.HasIndex(e => e.StudentId, "UQ__HealthPr__32C52A78BB3F8710").IsUnique();

            entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Height).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Student).WithOne(p => p.HealthProfile)
                .HasForeignKey<HealthProfile>(d => d.StudentId)
                .HasConstraintName("FK__HealthPro__Stude__59FA5E80");
        });

        modelBuilder.Entity<MedicalEvent>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__MedicalE__7944C8701A8AA7B0");

            entity.ToTable("MedicalEvent");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.EventDate).HasColumnType("datetime");
            entity.Property(e => e.EventTypeId).HasColumnName("EventTypeID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Location).HasMaxLength(100);
            entity.Property(e => e.SeverityId).HasColumnName("SeverityID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.EventType).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.EventTypeId)
                .HasConstraintName("FK__MedicalEv__Event__6D0D32F4");

            entity.HasOne(d => d.HandledByNavigation).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.HandledBy)
                .HasConstraintName("FK__MedicalEv__Handl__6C190EBB");

            entity.HasOne(d => d.Severity).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.SeverityId)
                .HasConstraintName("FK__MedicalEv__Sever__6E01572D");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicalEvents)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__MedicalEv__Stude__6B24EA82");
        });

        modelBuilder.Entity<MedicalEventType>(entity =>
        {
            entity.HasKey(e => e.EventTypeId).HasName("PK__MedicalE__A9216B1FCB5CD82D");

            entity.ToTable("MedicalEventType");

            entity.HasIndex(e => e.EventTypeName, "UQ__MedicalE__29BD765FB1E98487").IsUnique();

            entity.Property(e => e.EventTypeId).HasColumnName("EventTypeID");
            entity.Property(e => e.EventTypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<MedicalHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__MedicalH__4D7B4ADD55F863AE");

            entity.ToTable("MedicalHistory");

            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.DiseaseName).HasMaxLength(100);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicalHistories)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__MedicalHi__Stude__5CD6CB2B");
        });

        modelBuilder.Entity<MedicalSupply>(entity =>
        {
            entity.HasKey(e => e.SupplyId).HasName("PK__MedicalS__7CDD6C8EF2B7686D");

            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        modelBuilder.Entity<MedicationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Medicati__33A8519A5B81684D");

            entity.ToTable("MedicationRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Dosage).HasMaxLength(100);
            entity.Property(e => e.ImagePath).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MedicationName).HasMaxLength(100);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.RequestDate).HasColumnType("datetime");
            entity.Property(e => e.StatusId)
                .HasDefaultValue(1)
                .HasColumnName("StatusID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Parent).WithMany(p => p.MedicationRequestParents)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Paren__628FA481");

            entity.HasOne(d => d.ReceivedByNavigation).WithMany(p => p.MedicationRequestReceivedByNavigations)
                .HasForeignKey(d => d.ReceivedBy)
                .HasConstraintName("FK__Medicatio__Recei__6383C8BA");

            entity.HasOne(d => d.Status).WithMany(p => p.MedicationRequests)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("FK__Medicatio__Statu__6477ECF3");

            entity.HasOne(d => d.Student).WithMany(p => p.MedicationRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Medicatio__Stude__619B8048");
        });

        modelBuilder.Entity<MedicationRequestStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__Medicati__C8EE204393933B4B");

            entity.ToTable("MedicationRequestStatus");

            entity.HasIndex(e => e.StatusName, "UQ__Medicati__05E7698A098F8D36").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E327D7BBF47");

            entity.ToTable("Notification");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.ReceiverId).HasColumnName("ReceiverID");
            entity.Property(e => e.SentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.TypeId).HasColumnName("TypeID");

            entity.HasOne(d => d.Receiver).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__Recei__123EB7A3");

            entity.HasOne(d => d.Type).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__TypeI__1332DBDC");
        });

        modelBuilder.Entity<NotificationType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PK__Notifica__516F0395DCFA1360");

            entity.ToTable("NotificationType");

            entity.HasIndex(e => e.TypeName, "UQ__Notifica__D4E7DFA892B4C23A").IsUnique();

            entity.Property(e => e.TypeId).HasColumnName("TypeID");
            entity.Property(e => e.TypeName).HasMaxLength(50);
        });

        modelBuilder.Entity<ParentFeedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__ParentFe__6A4BEDF6A0F6FC70");

            entity.ToTable("ParentFeedback");

            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.RelatedId).HasColumnName("RelatedID");
            entity.Property(e => e.RelatedType).HasMaxLength(50);

            entity.HasOne(d => d.Parent).WithMany(p => p.ParentFeedbacks)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__ParentFee__Paren__1AD3FDA4");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3A90F0BD9B");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__8A2B6160147096DA").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<SeverityLevel>(entity =>
        {
            entity.HasKey(e => e.SeverityId).HasName("PK__Severity__C618A95185FD6A09");

            entity.ToTable("SeverityLevel");

            entity.HasIndex(e => e.SeverityName, "UQ__Severity__5A5FB2BC8FA9C334").IsUnique();

            entity.Property(e => e.SeverityId).HasColumnName("SeverityID");
            entity.Property(e => e.SeverityName).HasMaxLength(50);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52A79A67B3409");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Class).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");

            entity.HasOne(d => d.Gender).WithMany(p => p.Students)
                .HasForeignKey(d => d.GenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Student__GenderI__534D60F1");

            entity.HasOne(d => d.Parent).WithMany(p => p.Students)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Student__ParentI__5441852A");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC0FFEAAF9");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E48A069457").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("UserID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
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
                .HasConstraintName("FK__Users__RoleID__4F7CD00D");
        });

        modelBuilder.Entity<VaccinationCampaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PK__Vaccinat__3F5E8D790284A04B");

            entity.ToTable("VaccinationCampaign");

            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.VaccineName).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccinationCampaigns)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK__Vaccinati__Creat__75A278F5");
        });

        modelBuilder.Entity<VaccinationConsentRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Vaccinat__33A8519A6657617B");

            entity.ToTable("VaccinationConsentRequest");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentStatusId).HasColumnName("ConsentStatusID");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.RequestDate).HasColumnType("datetime");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Campa__797309D9");

            entity.HasOne(d => d.ConsentStatus).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.ConsentStatusId)
                .HasConstraintName("FK__Vaccinati__Conse__7B5B524B");

            entity.HasOne(d => d.Parent).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Paren__7A672E12");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationConsentRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Vaccinati__Stude__787EE5A0");
        });

        modelBuilder.Entity<VaccinationRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__Vaccinat__FBDF78C9AB3F0604");

            entity.ToTable("VaccinationRecord");

            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.CampaignId).HasColumnName("CampaignID");
            entity.Property(e => e.ConsentDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentStatusId).HasColumnName("ConsentStatusID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.VaccinationDate).HasColumnType("datetime");

            entity.HasOne(d => d.Campaign).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("FK__Vaccinati__Campa__00200768");

            entity.HasOne(d => d.ConsentStatus).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.ConsentStatusId)
                .HasConstraintName("FK__Vaccinati__Conse__01142BA1");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccinationRecords)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Vaccinati__Stude__7F2BE32F");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
