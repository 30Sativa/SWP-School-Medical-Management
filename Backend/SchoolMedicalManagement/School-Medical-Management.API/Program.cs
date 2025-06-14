using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Implement;
using SchoolMedicalManagement.Service.Interface;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Configuration.AddEnvironmentVariables();



// ✅ Thêm cấu hình CORS (Cho phép React ở localhost:3000 gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000") // React chạy ở port 3000
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});


builder.Services.AddEndpointsApiExplorer();

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


builder.Services.AddScoped<IAuthService, AuthService>();
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

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

//Database
builder.Services.AddDbContext<SwpEduHealV5Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


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

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();
// ✅ Kích hoạt CORS (phải đặt trước Authorization!)
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
