using System;

namespace SchoolMedicalManagement.Service.Utilities
{
    /// <summary>
    /// Lớp tiện ích tính toán các chỉ số sức khỏe
    /// </summary>
    public class HealthCalculator
    {
        /// <summary>
        /// Tính chỉ số BMI (Body Mass Index)
        /// </summary>
        /// <param name="height">Chiều cao (cm)</param>
        /// <param name="weight">Cân nặng (kg)</param>
        /// <returns>Ch? s? BMI</returns>
        public double CalculateBMI(double height, double weight)
        {
            if (height <= 0 || weight <= 0)
                throw new ArgumentException("Chiều cao và cân nặng phải lớn hơn 0");

            // Chuyển đổi chiều cao từ cm sang m
            double heightInMeters = height / 100;
            
            // Tính BMI = weight / (height^2)
            double bmi = weight / (heightInMeters * heightInMeters);

            // Làm tròn 2 chữ số thập phân
            return Math.Round(bmi, 2);
        }

        /// <summary>
        /// Phân loại BMI theo WHO
        /// </summary>
        /// <param name="bmi">Chỉ số BMI</param>
        /// <returns>Phân loại BMI</returns>
        public string ClassifyBMI(double bmi)
        {
            if (bmi < 0)
                throw new ArgumentException("BMI không thể âm");

            if (bmi < 18.5)
                return "Thiếu cân";
            else if (bmi < 25)
                return "Bình thường";
            else if (bmi < 30)
                return "Thừa cân";
            else
                return "Béo phì";
        }

        /// <summary>
        /// Tính tuổi dựa trên ngày sinh
        /// </summary>
        /// <param name="birthDate">Ngày sinh</param>
        /// <returns>Tuổi</returns>
        public int CalculateAge(DateTime birthDate)
        {
            if (birthDate > DateTime.Now)
                throw new ArgumentException("Ngày sinh không thể trong tương lai");

            DateTime today = DateTime.Today;
            int age = today.Year - birthDate.Year;

            // Kiểm tra xem sinh nhật đã qua chưa
            if (birthDate.Date > today.AddYears(-age))
                age--;

            return age;
        }

        /// <summary>
        /// Tính phần trăm tăng trưởng chiều cao
        /// </summary>
        /// <param name="previousHeight">Chiều cao trước (cm)</param>
        /// <param name="currentHeight">Chiều cao hiện tại (cm)</param>
        /// <returns>Phần trăm tăng trưởng</returns>
        public double CalculateGrowthPercentage(double previousHeight, double currentHeight)
        {
            if (previousHeight <= 0 || currentHeight <= 0)
                throw new ArgumentException("Chiều cao phải lớn hơn 0");

            if (previousHeight > currentHeight)
                throw new ArgumentException("Chiều cao hiện tại phải lớn hơn hoặc bằng chiều cao trước");

            double growthPercentage = ((currentHeight - previousHeight) / previousHeight) * 100;
            return Math.Round(growthPercentage, 2);
        }

        /// <summary>
        /// Kiểm tra xem một giá trị có nằm trong khoảng bình thường không
        /// </summary>
        /// <param name="value">Giá trị cần kiểm tra</param>
        /// <param name="minValue">Giá trị tối thiểu</param>
        /// <param name="maxValue">Giá trị tối đa</param>
        /// <returns>True nếu trong khoảng bình thường</returns>
        public bool IsInNormalRange(double value, double minValue, double maxValue)
        {
            if (minValue > maxValue)
                throw new ArgumentException("Giá trị tối thiểu phải nhỏ hơn giá trị tối đa");

            return value >= minValue && value <= maxValue;
        }

        /// <summary>
        /// Tính điểm sức khỏe tổng thể (0-100)
        /// </summary>
        /// <param name="bmi">Chỉ số BMI</param>
        /// <param name="age">Tuổi</param>
        /// <param name="hasChronicDisease">Có bệnh mãn tính không</param>
        /// <param name="hasAllergies">Có dị ứng không</param>
        /// <returns>Điểm sức khỏe (0-100)</returns>
        public int CalculateHealthScore(double bmi, int age, bool hasChronicDisease, bool hasAllergies)
        {
            if (bmi < 0 || age < 0)
                throw new ArgumentException("BMI và tuổi phải lớn hơn hoặc bằng 0");

            int score = 100;

            // Điểm trừ cho BMI
            string bmiClass = ClassifyBMI(bmi);
            switch (bmiClass)
            {
                case "Thiếu cân":
                    score -= 15;
                    break;
                case "Thừa cân":
                    score -= 10;
                    break;
                case "Béo phì":
                    score -= 25;
                    break;
            }

            // Điểm trừ cho tuổi (trẻ em dưới 5 tuổi hoặc trên 65 tuổi)
            if (age < 5 || age > 65)
                score -= 10;

            // Điểm trừ cho bệnh mãn tính
            if (hasChronicDisease)
                score -= 20;

            // Điểm trừ cho dị ứng
            if (hasAllergies)
                score -= 5;

            // Đảm bảo điểm không âm
            return Math.Max(0, score);
        }
    }
}