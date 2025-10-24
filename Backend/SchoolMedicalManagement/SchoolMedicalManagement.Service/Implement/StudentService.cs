using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;

namespace SchoolMedicalManagement.Service.Implement
{
    public class StudentService : IStudentService
    {
        private readonly StudentRepository _studentRepository;
        private readonly UserRepository _userRepository;

        public StudentService(StudentRepository studentRepository, UserRepository userRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
        }

        public async Task<BaseResponse> GetStudentList()
        {
            var students = (await _studentRepository.GetAllStudents())
                            .OrderByDescending(s => s.StudentId)
                            .ToList();

            var data = students.Select(s => new ListStudentResponse
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender?.GenderName ?? "Unknown",
                ClassName = s.Class,
                ParentName = s.Parent?.FullName ?? "No Parent",
                ParentId = s.ParentId,
                IsActive = s.IsActive
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách học sinh thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse> GetStudentById(int studentId)
        {
            var student = await _studentRepository.GetStudentById(studentId);

            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh với ID {studentId}.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy học sinh thành công.",
                Data = new ManagerStudentResponse
                {
                    StudentId = student.StudentId,
                    FullName = student.FullName,
                    DateOfBirth = student.DateOfBirth,
                    GenderName = student.Gender.GenderName,
                    Class = student.Class,
                    ParentId = student.ParentId,
                    ParentName = student.Parent?.FullName ?? "No Parent",
                }
            };
        }

        public async Task<BaseResponse> CreateStudent(CreateStudentRequest request)
        {
            if (request.ParentId == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "ID phụ huynh là bắt buộc.",
                    Data = null
                };
            }

            var parentUser = await _userRepository.GetUserById(request.ParentId);
            if (parentUser == null || parentUser.RoleId != 3)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "ID phụ huynh không hợp lệ hoặc người dùng không phải là phụ huynh.",
                    Data = null
                };
            }

            var student = new Student
            {
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                GenderId = request.GenderId,
                Class = request.Class,
                ParentId = request.ParentId
            };

            var createdStudent = await _studentRepository.CreateStudent(student);

            if (createdStudent == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Tạo học sinh thất bại. Vui lòng kiểm tra dữ liệu yêu cầu.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo học sinh thành công.",
                Data = new ManagerStudentResponse
                {
                    StudentId = createdStudent.StudentId,
                    FullName = createdStudent.FullName,
                    DateOfBirth = createdStudent.DateOfBirth,
                    GenderName = createdStudent.Gender.GenderName,
                    Class = createdStudent.Class,
                    ParentName = parentUser.FullName,
                    ParentId = parentUser.UserId
                }
            };
        }

        public async Task<BaseResponse> UpdateStudent(int id, UpdateStudentRequest request)
        {
            var studentToUpdate = await _studentRepository.GetStudentById(id);
            if (studentToUpdate == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh với ID {studentToUpdate.StudentId}.",
                    Data = null
                };
            }

            if (request.ParentId.HasValue)
            {
                var parentUser = await _userRepository.GetUserById(request.ParentId.Value);
                if (parentUser == null || parentUser.RoleId != 3)
                    return new BaseResponse 
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = "Vui lòng nhập đúng ID phụ huynh.",
                        Data = null
                    };
                studentToUpdate.ParentId = request.ParentId.Value;
            }

            studentToUpdate.FullName = string.IsNullOrWhiteSpace(request.FullName) ? studentToUpdate.FullName : request.FullName;
            // Only update DateOfBirth if provided by frontend
            studentToUpdate.DateOfBirth = request.DateOfBirth != default ? DateOnly.FromDateTime(request.DateOfBirth) : studentToUpdate.DateOfBirth;

            studentToUpdate.Gender.GenderId = request.GenderId > 0 ? studentToUpdate.GenderId : request.GenderId;
            studentToUpdate.Class = string.IsNullOrWhiteSpace(request.ClassName) ? studentToUpdate.Class : request.ClassName;
            studentToUpdate.ParentId = request.ParentId ?? studentToUpdate.ParentId;

            var updated = await _studentRepository.UpdateStudent(id, studentToUpdate);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Cập nhật dữ liệu học sinh thất bại.",
                    Data = null
                };
            }

            // Adding try-catch for null handling
            ManagerStudentResponse responseData;
            try {
                responseData = new ManagerStudentResponse
                {
                    StudentId = updated.StudentId,
                    FullName = updated.FullName,
                    Class = updated.Class,
                    DateOfBirth = updated.DateOfBirth,
                    GenderName = updated.Gender.GenderName,
                    ParentId = updated.ParentId,
                    ParentName = updated.Parent.FullName
                };
            } catch (NullReferenceException) {
                responseData = new ManagerStudentResponse
                {
                    StudentId = updated.StudentId,
                    FullName = updated.FullName,
                    Class = updated.Class,
                    DateOfBirth = updated.DateOfBirth,
                    GenderName = updated.Gender.GenderName,
                    ParentId = updated.ParentId,
                    ParentName = "No Parent Assigned"
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật dữ liệu học sinh thành công.",
                Data = responseData
            };
        }

        public async Task<BaseResponse> DeleteStudent(int studentId)
        {
            var success = await _studentRepository.SoftDeleteStudent(studentId);
            if (!success)
            {
                return new BaseResponse { Status = StatusCodes.Status404NotFound.ToString(), Message = "Không tìm thấy học sinh để xóa.", Data = null };
            }
            return new BaseResponse { Status = StatusCodes.Status200OK.ToString(), Message = "Xóa học sinh thành công.", Data = null };
        }

        public async Task<BaseResponse> GetHealthProfileByStudentId(GetHealthProfileRequest request)
        {
            var healthProfile = await _studentRepository.GetHealthProfileByStudentId(request.StudentId);

            if (healthProfile == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy hồ sơ sức khỏe.",
                    Data = null
                };
            }

            var response = new ManagerHealthProfileResponse
            {
                ProfileId = healthProfile.ProfileId,
                StudentId = healthProfile.StudentId,
                Height = healthProfile.Height,
                Weight = healthProfile.Weight,
                ChronicDiseases = healthProfile.ChronicDiseases,
                Allergies = healthProfile.Allergies,
                GeneralNote = healthProfile.GeneralNote,
                IsActive = healthProfile.IsActive
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy hồ sơ sức khỏe thành công.",
                Data = response
            };
        }

        public async Task<BaseResponse> GetStudentsOfParent(Guid parentId)
        {
            var parentUser = await _userRepository.GetUserById(parentId);
            if (parentUser == null || parentUser.RoleId != 3)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "ID phụ huynh không hợp lệ.",
                    Data = null
                };
            }

            var students = await _studentRepository.GetStudentsByParentId(parentId);

            if (students == null || !students.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh cho phụ huynh với ID {parentId}.",
                    Data = null
                };
            }

            var studentList = students.Select(student => new ListStudentResponse
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender.GenderName,
                ClassName = student.Class,
                ParentName = parentUser.FullName,
                ParentId = parentUser.UserId,
                IsActive = student.IsActive
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách học sinh thành công.",
                Data = studentList
            };
        }

        public async Task<BaseResponse> GetStudentsByClass(string className)
        {
            var students = await _studentRepository.GetStudentsByClass(className);
            var data = students.Select(s => new ListStudentResponse
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender?.GenderName ?? "Unknown",
                ClassName = s.Class,
                ParentName = s.Parent?.FullName ?? "No Parent",
                ParentId = s.ParentId,
                IsActive = s.IsActive
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Lấy danh sách học sinh lớp {className} thành công.",
                Data = data
            };
        }
    }
}
