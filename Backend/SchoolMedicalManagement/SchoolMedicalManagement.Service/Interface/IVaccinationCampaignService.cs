using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IVaccinationCampaignService
    {
        // Lấy danh sách chiến dịch tiêm chủng
        Task<BaseResponse> GetVaccinationCampaignsAsync();

        // Lấy danh sách chiến dịch tiêm chủng đang hoạt động
        Task<BaseResponse> GetActiveVaccinationCampaignsAsync();

        // Lấy danh sách chiến dịch tiêm chủng theo trạng thái
        Task<BaseResponse> GetVaccinationCampaignsByStatusAsync(int statusId);

        // Lấy chi tiết một chiến dịch tiêm chủng
        Task<BaseResponse> GetVaccinationCampaignAsync(int campaignId);

        // Tạo mới chiến dịch tiêm chủng
        Task<BaseResponse> CreateVaccinationCampaignAsync(CreateVaccinationCampaignRequest request);

        // Cập nhật chiến dịch tiêm chủng
        Task<BaseResponse> UpdateVaccinationCampaignAsync(UpdateVaccinationCampaignRequest request);

        // Vô hiệu hóa chiến dịch tiêm chủng
        Task<BaseResponse> DeactivateVaccinationCampaignAsync(int campaignId);

        // Kích hoạt lại chiến dịch tiêm chủng
        Task<BaseResponse> ActivateVaccinationCampaignAsync(int campaignId);

        // Lấy danh sách tất cả yêu cầu xác nhận của một chiến dịch
        Task<BaseResponse> GetCampaignConsentRequestsAsync(int campaignId);

        // Gửi phiếu đồng ý cho phụ huynh
        Task<BaseResponse> SendConsentRequestAsync(int campaignId, int studentId, Guid parentId, int? autoDeclineAfterDays = null);

        // Phụ huynh phản hồi đồng ý/từ chối
        Task<BaseResponse> UpdateConsentRequestAsync(int requestId, UpdateConsentRequestRequest request);


        // Lấy lịch sử tiêm chủng của học sinh
        Task<BaseResponse> GetStudentVaccinationRecordsAsync(int studentId);

        // Ghi nhận kết quả tiêm chủng cho học sinh
        Task<BaseResponse> CreateVaccinationRecordAsync(CreateVaccinationRecordRequest request);

        // Lấy danh sách yêu cầu đã đồng ý của một chiến dịch
        Task<BaseResponse> GetApprovedConsentRequestsAsync(int campaignId);

        // Lấy danh sách học sinh từ chối tiêm của một chiến dịch
        Task<BaseResponse> GetDeclinedConsentRequestsAsync(int campaignId);

        // Lấy danh sách chiến dịch theo người tạo
        Task<BaseResponse> GetCampaignsByCreatorAsync(Guid creatorId);

        // Kiểm tra trạng thái chiến dịch
        Task<BaseResponse> CheckCampaignStatusAsync(int campaignId);

        // Gửi phiếu đồng ý theo lớp học
        Task<BaseResponse> SendConsentRequestsByClassAsync(int campaignId, SendConsentByClassRequest request);

        // Gửi phiếu đồng ý cho tất cả phụ huynh
        Task<BaseResponse> SendConsentRequestsToAllParentsAsync(int campaignId, int? autoDeclineAfterDays = null);

        // Gửi phiếu đồng ý theo danh sách học sinh
        Task<BaseResponse> SendConsentRequestsBulkAsync(int campaignId, SendConsentBulkRequest request);

        // Lấy phiếu đồng ý tiêm chủng theo requestId
        Task<BaseResponse> GetConsentRequestByIdAsync(int requestId);

        // Lấy tất cả phiếu đồng ý tiêm chủng của một học sinh
        Task<BaseResponse> GetConsentRequestsByStudentIdAsync(int studentId);

        // Cập nhật bản ghi tiêm chủng
        Task<BaseResponse> UpdateVaccinationRecordAsync(UpdateVaccinationRecordRequest request);

        // Lấy danh sách bản ghi tiêm chủng theo chiến dịch
        Task<BaseResponse> GetVaccinationRecordsByCampaignAsync(int campaignId);

        // Gửi lại phiếu đồng ý
        Task<BaseResponse> ResendConsentRequestAsync(int requestId, int? autoDeclineAfterDays = null);

        // Lấy tóm tắt thống kê chiến dịch
        Task<BaseResponse> GetCampaignSummaryAsync(int campaignId);

        // Lấy danh sách phiếu đồng ý đang chờ
        Task<BaseResponse> GetPendingConsentRequestsAsync(int campaignId);
    }
}
