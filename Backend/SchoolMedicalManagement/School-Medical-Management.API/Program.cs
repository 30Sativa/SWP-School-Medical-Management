using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Implement;
using SchoolMedicalManagement.Service.Interface;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Hangfire;
using Hangfire.MemoryStorage;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Configuration.AddEnvironmentVariables();



builder.Services.AddEndpointsApiExplorer();

//DI for Repo
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<StudentRepository>();
builder.Services.AddScoped<HealthProfileRepository>();
builder.Services.AddScoped<HealthCheckCampaignRepository>();
builder.Services.AddScoped<MedicalSupplyRepository>();
builder.Services.AddScoped<MedicalEventRepository>();
builder.Services.AddScoped<MedicalHistoryService>();
builder.Services.AddScoped<HealthCheckSummaryRepository>();
builder.Services.AddScoped<VaccinationCampaignRepository>();
builder.Services.AddScoped<MedicalHistoryRepository>();
builder.Services.AddScoped<MedicationRequestRepository>();
builder.Services.AddScoped<NotificationRepository>();
builder.Services.AddScoped<NotificationTypeRepository>();
builder.Services.AddScoped<MedicalEventTypeRepository>();
builder.Services.AddScoped<BlogPostRepository>();
builder.Services.AddScoped<ParentFeedbackRepository>();

//DI for Service
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IEmailService, EmailService>();
// Đăng ký VaccinationCampaignService cho Hangfire job
builder.Services.AddScoped<VaccinationCampaignService>();

builder.Services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IHealthProfileService, HealthProfileService>();
builder.Services.AddScoped<IHealthCheckCampaignService, HealthCheckCampaignService>();
builder.Services.AddScoped<IMedicalSupplyService, MedicalSupplyService>();
builder.Services.AddScoped<IMedicalEventService, MedicalEventService>();
builder.Services.AddScoped<IMedicationRequestService, MedicationRequestService>();
builder.Services.AddScoped<IHealthCheckSummaryService, HealthCheckSummaryService>();
builder.Services.AddScoped<IVaccinationCampaignService, VaccinationCampaignService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<INotificationTypeService, NotificationTypeService>();
builder.Services.AddScoped<IMedicalEventTypeService, MedicalEventTypeService>();
builder.Services.AddScoped<IBlogPostService, BlogPostService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IParentFeedbackService, ParentFeedbackService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", // Local development
                "https://schoolmedicalmanagement.id.vn" // Production
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Nếu dùng cookies/token
    });
});

//Database
builder.Services.AddDbContext<SwpEduHealV5Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Redis đăng ký dịch vụ IDistributedCache (Redis cache) để lưu OTP
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = "SchoolMedicalManagement_";
});

// Swagger And Authentication
builder.Services.AddSwaggerGen(option =>
{
    option.DescribeAllParametersInCamelCase();
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";

                var message = context.Exception switch
                {
                    SecurityTokenExpiredException => "Token đã hết hạn.",
                    _ => "Token không hợp lệ."
                };

                return context.Response.WriteAsync($"{{\"error\": \"{message}\"}}");
            },
            OnChallenge = context =>
            {
                context.HandleResponse(); // Ngăn ASP.NET trả lỗi mặc định
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\": \"Bạn chưa đăng nhập hoặc token thiếu.\"}");
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\": \"Bạn không có quyền truy cập chức năng này.\"}");
            }
        };
    });

// Hangfire cấu hình MemoryStorage cho dev/test
builder.Services.AddHangfire(config =>
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
          .UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseMemoryStorage());
builder.Services.AddHangfireServer();

var app = builder.Build();

// Configure the HTTP request pipeline.


// Replace the problematic line with the following code:

//Test UptimeRobot
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
app.MapMethods("/api/health", new[] { "HEAD" }, () => Results.Ok());

app.UseStaticFiles();
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("MyCorsPolicy");

app.UseHttpsRedirection();



app.UseAuthorization();

app.MapControllers();

// Bật Hangfire Dashboard tại /hangfire
app.UseHangfireDashboard();

app.Run();
