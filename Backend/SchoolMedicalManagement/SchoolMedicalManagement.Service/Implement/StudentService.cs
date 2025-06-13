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

        public async Task<List<ListStudentResponse>> GetStudentList()
        {
            var students = (await _studentRepository.GetAllStudents())
                            .OrderByDescending(s => s.StudentId)
                            .ToList();

            return students.Select(s => new ListStudentResponse
            {
                StudentId = s.StudentId,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender?.GenderName ?? "Unknown",
                ClassName = s.Class,
                ParentName = s.Parent?.FullName,
                ParentId = s.ParentId,
                IsActive = s.IsActive
            }).ToList();
        }

        public async Task<BaseResponse> GetStudentById(int studentId)
        {
            var student = await _studentRepository.GetStudentById(studentId);

            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Student with ID {studentId} not found.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Student found successfully.",
                Data = new ManagerStudentResponse
                {
                    StudentId = student.StudentId,
                    FullName = student.FullName,
                    DateOfBirth = student.DateOfBirth,
                    GenderName = student.Gender.GenderName,
                    Class = student.Class,
                    ParentId = student.ParentId,
                    ParentName = student.Parent?.FullName,
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
                    Message = "Parent ID is required.",
                    Data = null
                };
            }

            var parentUser = await _userRepository.GetUserById(request.ParentId);
            if (parentUser == null || parentUser.RoleId != 3)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Invalid Parent ID or the user is not a parent.",
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
                    Message = "Failed to create student. Please check the request data.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Student created successfully.",
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
                        Message = $"Hãy nhập đúng id phụ huynh.",
                        Data = null
                    };
                studentToUpdate.ParentId = request.ParentId.Value;
            }

            studentToUpdate.FullName = string.IsNullOrWhiteSpace(request.FullName) ? studentToUpdate.FullName : request.FullName;
            // Only update DateOfBirth if provided by frontend
            if (request.DateOfBirth.HasValue && request.DateOfBirth.Value != default)
            {
                studentToUpdate.DateOfBirth = request.DateOfBirth.Value;
            }
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

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật dữ liệu học sinh thành công.",
                Data = new ManagerStudentResponse
                {
                    StudentId = updated.StudentId,
                    FullName = updated.FullName,
                    Class = updated.Class,
                    DateOfBirth = updated.DateOfBirth,
                    GenderName = updated.Gender.GenderName,
                    ParentName = updated.Parent.FullName
                }
            };
        }

        public async Task<bool> DeleteStudent(int studentId)
        {
            return await _studentRepository.SoftDeleteStudent(studentId);
        }

        public async Task<BaseResponse> GetHealthProfileByStudentId(GetHealthProfileRequest request)
        {
            var healthProfile = await _studentRepository.GetHealthProfileByStudentId(request.StudentId);

            if (healthProfile == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Health profile not found.",
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
                Message = "Health profile found successfully.",
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
                    Message = "Invalid parent ID.",
                    Data = null
                };
            }

            var students = await _studentRepository.GetStudentsByParentId(parentId);

            if (students == null || !students.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"No students found for parent with ID {parentId}.",
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
                Message = "Students retrieved successfully.",
                Data = studentList
            };
        }
    }
}
