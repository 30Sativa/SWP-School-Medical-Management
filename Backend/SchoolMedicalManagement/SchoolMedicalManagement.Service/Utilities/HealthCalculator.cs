using System;

namespace SchoolMedicalManagement.Service.Utilities
{
    /// <summary>
    /// L?p ti?n ích tính toán các ch? s? s?c kh?e
    /// </summary>
    public class HealthCalculator
    {
        /// <summary>
        /// Tính ch? s? BMI (Body Mass Index)
        /// </summary>
        /// <param name="height">Chi?u cao (cm)</param>
        /// <param name="weight">Cân n?ng (kg)</param>
        /// <returns>Ch? s? BMI</returns>
        public double CalculateBMI(double height, double weight)
        {
            if (height <= 0 || weight <= 0)
                throw new ArgumentException("Chi?u cao và cân n?ng ph?i l?n h?n 0");

            // Chuy?n ??i chi?u cao t? cm sang m
            double heightInMeters = height / 100;
            
            // Tính BMI = weight / (height^2)
            double bmi = weight / (heightInMeters * heightInMeters);
            
            // Làm tròn 2 ch? s? th?p phân
            return Math.Round(bmi, 2);
        }

        /// <summary>
        /// Phân lo?i BMI theo WHO
        /// </summary>
        /// <param name="bmi">Ch? s? BMI</param>
        /// <returns>Phân lo?i BMI</returns>
        public string ClassifyBMI(double bmi)
        {
            if (bmi < 0)
                throw new ArgumentException("BMI không th? âm");

            if (bmi < 18.5)
                return "Thi?u cân";
            else if (bmi < 25)
                return "Bình th??ng";
            else if (bmi < 30)
                return "Th?a cân";
            else
                return "Béo phì";
        }

        /// <summary>
        /// Tính tu?i d?a trên ngày sinh
        /// </summary>
        /// <param name="birthDate">Ngày sinh</param>
        /// <returns>Tu?i</returns>
        public int CalculateAge(DateTime birthDate)
        {
            if (birthDate > DateTime.Now)
                throw new ArgumentException("Ngày sinh không th? trong t??ng lai");

            DateTime today = DateTime.Today;
            int age = today.Year - birthDate.Year;
            
            // Ki?m tra xem sinh nh?t ?ã qua ch?a
            if (birthDate.Date > today.AddYears(-age))
                age--;

            return age;
        }

        /// <summary>
        /// Tính ph?n tr?m t?ng tr??ng chi?u cao
        /// </summary>
        /// <param name="previousHeight">Chi?u cao tr??c (cm)</param>
        /// <param name="currentHeight">Chi?u cao hi?n t?i (cm)</param>
        /// <returns>Ph?n tr?m t?ng tr??ng</returns>
        public double CalculateGrowthPercentage(double previousHeight, double currentHeight)
        {
            if (previousHeight <= 0 || currentHeight <= 0)
                throw new ArgumentException("Chi?u cao ph?i l?n h?n 0");

            if (previousHeight > currentHeight)
                throw new ArgumentException("Chi?u cao hi?n t?i ph?i l?n h?n ho?c b?ng chi?u cao tr??c");

            double growthPercentage = ((currentHeight - previousHeight) / previousHeight) * 100;
            return Math.Round(growthPercentage, 2);
        }

        /// <summary>
        /// Ki?m tra xem m?t giá tr? có n?m trong kho?ng bình th??ng không
        /// </summary>
        /// <param name="value">Giá tr? c?n ki?m tra</param>
        /// <param name="minValue">Giá tr? t?i thi?u</param>
        /// <param name="maxValue">Giá tr? t?i ?a</param>
        /// <returns>True n?u trong kho?ng bình th??ng</returns>
        public bool IsInNormalRange(double value, double minValue, double maxValue)
        {
            if (minValue > maxValue)
                throw new ArgumentException("Giá tr? t?i thi?u ph?i nh? h?n giá tr? t?i ?a");

            return value >= minValue && value <= maxValue;
        }

        /// <summary>
        /// Tính ?i?m s?c kh?e t?ng th? (0-100)
        /// </summary>
        /// <param name="bmi">Ch? s? BMI</param>
        /// <param name="age">Tu?i</param>
        /// <param name="hasChronicDisease">Có b?nh mãn tính không</param>
        /// <param name="hasAllergies">Có d? ?ng không</param>
        /// <returns>?i?m s?c kh?e (0-100)</returns>
        public int CalculateHealthScore(double bmi, int age, bool hasChronicDisease, bool hasAllergies)
        {
            if (bmi < 0 || age < 0)
                throw new ArgumentException("BMI và tu?i ph?i l?n h?n ho?c b?ng 0");

            int score = 100;

            // ?i?m tr? cho BMI
            string bmiClass = ClassifyBMI(bmi);
            switch (bmiClass)
            {
                case "Thi?u cân":
                    score -= 15;
                    break;
                case "Th?a cân":
                    score -= 10;
                    break;
                case "Béo phì":
                    score -= 25;
                    break;
            }

            // ?i?m tr? cho tu?i (tr? em d??i 5 tu?i ho?c trên 65 tu?i)
            if (age < 5 || age > 65)
                score -= 10;

            // ?i?m tr? cho b?nh mãn tính
            if (hasChronicDisease)
                score -= 20;

            // ?i?m tr? cho d? ?ng
            if (hasAllergies)
                score -= 5;

            // ??m b?o ?i?m không âm
            return Math.Max(0, score);
        }
    }
}