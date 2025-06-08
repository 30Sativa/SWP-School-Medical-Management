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

        public StudentService(StudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public async Task<List<ListStudentResponse>> GetStudentList()
        {
            var students = await _studentRepository.GetAllStudent();
            List<ListStudentResponse> studentListResponses = new List<ListStudentResponse>();

            foreach (var student in students)
            {
                studentListResponses.Add(new ListStudentResponse
                {
                    StudentId = student.StudentId,
                    FullName = student.FullName,
                    DateOfBirth = student.DateOfBirth,
                    Gender = student.Gender,
                    Class = student.Class,
                    Parent = student.Parent?.FullName,
                    ParentId = student.ParentId
                });
            }
            return studentListResponses;
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
                    Gender = student.Gender,
                    Class = student.Class,
                    Parent = student.Parent?.FullName,
                    ParentId = student.ParentId
                }
            };
        }

        public async Task<BaseResponse> CreateStudent(CreateStudentRequest request)
        {
            var student = new Student
            {
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
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
                    Gender = createdStudent.Gender,
                    Class = createdStudent.Class,
                    Parent = createdStudent.Parent?.Username
                }
            };
        }

        public async Task<bool> UpdateStudent(UpdateStudentRequest request)
        {
            var studentToUpdate = await _studentRepository.GetStudentById(request.StudentId);
            if (studentToUpdate == null)
            {
                return false;
            }

            studentToUpdate.FullName = string.IsNullOrEmpty(request.FullName) ? studentToUpdate.FullName : request.FullName;
            studentToUpdate.DateOfBirth = request.DateOfBirth == default ? studentToUpdate.DateOfBirth : request.DateOfBirth;
            studentToUpdate.Gender = string.IsNullOrEmpty(request.Gender) ? studentToUpdate.Gender : request.Gender;
            studentToUpdate.Class = string.IsNullOrEmpty(request.Class) ? studentToUpdate.Class : request.Class;
            studentToUpdate.ParentId = request.ParentId ?? studentToUpdate.ParentId;

            return await _studentRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteStudent(int studentId)
        {
            return await _studentRepository.DeleteStudent(studentId);
        }

        public async Task<BaseResponse> GetHealthProfileByStudentId(GetHealthProfileRequest request)
        {
            var healthProfile = await _studentRepository.GetHealthProfileByStudentId(request);

            if (healthProfile == null)
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Health profile not found.",
                    Data = null
                };

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
    }
}