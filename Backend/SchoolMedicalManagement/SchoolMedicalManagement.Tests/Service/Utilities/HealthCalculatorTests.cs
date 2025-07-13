using Microsoft.VisualStudio.TestTools.UnitTesting;
using SchoolMedicalManagement.Service.Utilities;
using System;

namespace SchoolMedicalManagement.Tests.Service.Utilities
{
    [TestClass]
    public class HealthCalculatorTests
    {
        private HealthCalculator _healthCalculator;

        //Code có 3 phần chính: Arrange-Act-Assert.
        //Arrange là chuẩn bị data,
        //Act là chạy function,
        //Assert là check kết quả

        [TestInitialize]
        public void Setup()
        {
            _healthCalculator = new HealthCalculator();
        }

        #region CalculateBMI Tests - Black Box Testing

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("EP-Valid")]
        public void TC01_CalculateBMI_ValidInput_ReturnsCorrectValue()
        {
            // Arrange - Chuẩn bị dữ liệu
            double height = 170; // cm - chiều cao bình thường
            double weight = 70;  // kg - cân nặng bình thường
            double expected = 24.22; // BMI = 70 / (1.7)² = 24.22

            // Act - Thực hiện hành động
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert - Kiểm tra kết quả
            Assert.AreEqual(expected, actual, "TC01: BMI calculation should be correct");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC03_CalculateBMI_MinimumValidHeight_ReturnsValidBMI()
        {
            // Arrange
            double height = 50; // cm - chiều cao tối thiểu hợp lệ
            double weight = 10; // kg - cân nặng tương ứng
            double expected = 40.0; // BMI = 10 / (0.5)² = 40.0

            // Act
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert
            Assert.AreEqual(expected, actual, "TC03: Minimum height boundary test");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC04_CalculateBMI_MaximumValidHeight_ReturnsValidBMI()
        {
            // Arrange
            double height = 250; // cm - chiều cao tối đa hợp lệ (người cao nhất thế giới)
            double weight = 100; // kg - cân nặng tương ứng
            double expected = 16.0; // BMI = 100 / (2.5)² = 16.0

            // Act
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert
            Assert.AreEqual(expected, actual, "TC04: Maximum height boundary test");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC05_CalculateBMI_MinimumValidWeight_ReturnsValidBMI()
        {
            // Arrange
            double height = 100; // cm - chiều cao trẻ em
            double weight = 1;   // kg - cân nặng tối thiểu hợp lệ
            double expected = 1.0; // BMI = 1 / (1.0)² = 1.0

            // Act
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert
            Assert.AreEqual(expected, actual, "TC05: Minimum weight boundary test");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC06_CalculateBMI_MaximumValidWeight_ReturnsValidBMI()
        {
            // Arrange
            double height = 200; // cm - chiều cao người lớn
            double weight = 500; // kg - cân nặng tối đa hợp lệ
            double expected = 125.0; // BMI = 500 / (2.0)² = 125.0

            // Act
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert
            Assert.AreEqual(expected, actual, "TC06: Maximum weight boundary test");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("EP-Invalid")]
        public void TC07_CalculateBMI_ZeroHeight_ThrowsArgumentException()
        {
            // Arrange
            double height = 0; // Invalid: chiều cao = 0
            double weight = 70;
            bool exceptionThrown = false;
            string actualMessage = "";
            string actualParamName = "";

            // Act
            try
            {
                _healthCalculator.CalculateBMI(height, weight);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                actualMessage = ex.Message;
                actualParamName = ex.ParamName;
            }

            // Assert
            Assert.IsTrue(exceptionThrown, "TC07: Should throw ArgumentException for zero height");
            Assert.IsTrue(actualMessage.Contains("Chiều cao phải lớn hơn 0"), "TC07: Exception message should mention height requirement");
            Assert.AreEqual("height", actualParamName, "TC07: Parameter name should be 'height'");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("EP-Invalid")]
        public void TC08_CalculateBMI_NegativeHeight_ThrowsArgumentException()
        {
            // Arrange
            double height = -170; // Invalid: chiều cao âm
            double weight = 70;
            bool exceptionThrown = false;
            string actualMessage = "";
            string actualParamName = "";

            // Act
            try
            {
                _healthCalculator.CalculateBMI(height, weight);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                actualMessage = ex.Message;
                actualParamName = ex.ParamName;
            }

            // Assert
            Assert.IsTrue(exceptionThrown, "TC08: Should throw ArgumentException for negative height");
            Assert.IsTrue(actualMessage.Contains("Chiều cao phải lớn hơn 0"), "TC08: Exception message should mention height requirement");
            Assert.AreEqual("height", actualParamName, "TC08: Parameter name should be 'height'");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("EP-Invalid")]
        public void TC09_CalculateBMI_ZeroWeight_ThrowsArgumentException()
        {
            // Arrange
            double height = 170;
            double weight = 0; // Invalid: cân nặng = 0
            bool exceptionThrown = false;
            string actualMessage = "";
            string actualParamName = "";

            // Act
            try
            {
                _healthCalculator.CalculateBMI(height, weight);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                actualMessage = ex.Message;
                actualParamName = ex.ParamName;
            }

            // Assert
            Assert.IsTrue(exceptionThrown, "TC09: Should throw ArgumentException for zero weight");
            Assert.IsTrue(actualMessage.Contains("Cân nặng phải lớn hơn 0"), "TC09: Exception message should mention weight requirement");
            Assert.AreEqual("weight", actualParamName, "TC09: Parameter name should be 'weight'");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("EP-Invalid")]
        public void TC10_CalculateBMI_NegativeWeight_ThrowsArgumentException()
        {
            // Arrange
            double height = 170;
            double weight = -70; // Invalid: cân nặng âm
            bool exceptionThrown = false;
            string actualMessage = "";
            string actualParamName = "";

            // Act
            try
            {
                _healthCalculator.CalculateBMI(height, weight);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                actualMessage = ex.Message;
                actualParamName = ex.ParamName;
            }

            // Assert
            Assert.IsTrue(exceptionThrown, "TC10: Should throw ArgumentException for negative weight");
            Assert.IsTrue(actualMessage.Contains("Cân nặng phải lớn hơn 0"), "TC10: Exception message should mention weight requirement");
            Assert.AreEqual("weight", actualParamName, "TC10: Parameter name should be 'weight'");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Precision")]
        public void TC11_CalculateBMI_DecimalPrecision_ReturnsRoundedValue()
        {
            // Arrange
            double height = 175.5; // cm - chiều cao thập phân
            double weight = 68.7;  // kg - cân nặng thập phân
            double expected = 22.31; // BMI làm tròn 2 chữ số thập phân

            // Act
            double actual = _healthCalculator.CalculateBMI(height, weight);

            // Assert
            Assert.AreEqual(expected, actual, "TC11: Decimal precision should be handled correctly");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Invalid")]
        public void TC22_CalculateBMI_HeightBelowRange_ThrowsArgumentOutOfRangeException()
        {
            // Arrange
            double height = 49.9; // Invalid: Dưới ngưỡng tối thiểu 50 cm
            double weight = 60;

            // Act & Assert
            var ex = Assert.ThrowsException<ArgumentOutOfRangeException>(() => _healthCalculator.CalculateBMI(height, weight));
            Assert.AreEqual("height", ex.ParamName, "TC22: Parameter name should be 'height'");
            Assert.IsTrue(ex.Message.Contains("Chiều cao phải từ 50-250 cm"), "TC22: Exception message should mention valid height range");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Invalid")]
        public void TC23_CalculateBMI_HeightAboveRange_ThrowsArgumentOutOfRangeException()
        {
            // Arrange
            double height = 250.1; // Invalid: Trên ngưỡng tối đa 250 cm
            double weight = 100;

            // Act & Assert
            var ex = Assert.ThrowsException<ArgumentOutOfRangeException>(() => _healthCalculator.CalculateBMI(height, weight));
            Assert.AreEqual("height", ex.ParamName, "TC23: Parameter name should be 'height'");
            Assert.IsTrue(ex.Message.Contains("Chiều cao phải từ 50-250 cm"), "TC23: Exception message should mention valid height range");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Invalid")]
        public void TC24_CalculateBMI_WeightBelowRange_ThrowsArgumentOutOfRangeException()
        {
            // Arrange
            double height = 160;
            double weight = 0.9; // Invalid: Dưới ngưỡng tối thiểu 1 kg

            // Act & Assert
            var ex = Assert.ThrowsException<ArgumentOutOfRangeException>(() => _healthCalculator.CalculateBMI(height, weight));
            Assert.AreEqual("weight", ex.ParamName, "TC24: Parameter name should be 'weight'");
            Assert.IsTrue(ex.Message.Contains("Cân nặng phải từ 1-500 kg"), "TC24: Exception message should mention valid weight range");
        }

        [TestMethod]
        [TestCategory("CalculateBMI")]
        [TestCategory("BVA-Invalid")]
        public void TC25_CalculateBMI_WeightAboveRange_ThrowsArgumentOutOfRangeException()
        {
            // Arrange
            double height = 180;
            double weight = 500.1; // Invalid: Trên ngưỡng tối đa 500 kg

            // Act & Assert
            var ex = Assert.ThrowsException<ArgumentOutOfRangeException>(() => _healthCalculator.CalculateBMI(height, weight));
            Assert.AreEqual("weight", ex.ParamName, "TC25: Parameter name should be 'weight'");
            Assert.IsTrue(ex.Message.Contains("Cân nặng phải từ 1-500 kg"), "TC25: Exception message should mention valid weight range");
        }

        #endregion

        #region ClassifyBMI Tests - Black Box Testing

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("EP-Underweight")]
        public void TC12_ClassifyBMI_UnderweightValue_ReturnsThieuCan()
        {
            // Arrange
            double bmi = 18.0; // BMI < 18.5 = Thiếu cân
            string expected = "Thiếu cân";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual, "TC12: BMI < 18.5 should return 'Thiếu cân'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC13_ClassifyBMI_JustBelowNormal_ReturnsThieuCan()
        {
            // Arrange
            double bmi = 18.4; // Just below WHO normal threshold
            string expected = "Thiếu cân";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual, "TC13: BMI = 18.4 should still be 'Thiếu cân'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC14_ClassifyBMI_WHO_BoundaryNormalStart_ReturnsBinhThuong()
        {
            // Arrange
            double bmi = 18.5; // WHO boundary: bắt đầu phạm vi "Bình thường"
            string expected = "Bình thường";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual,
                "TC14: BMI = 18.5 (WHO critical boundary) should return 'Bình thường'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("EP-Normal")]
        public void TC15_ClassifyBMI_NormalValue_ReturnsBinhThuong()
        {
            // Arrange
            double bmi = 22.0; // Normal BMI value
            string expected = "Bình thường";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual, "TC15: Normal BMI should return 'Bình thường'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC16_ClassifyBMI_JustBelowOverweight_ReturnsBinhThuong()
        {
            // Arrange
            double bmi = 24.9; // Just below WHO overweight threshold
            string expected = "Bình thường";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual,
                "TC16: BMI = 24.9 should still be 'Bình thường'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC17_ClassifyBMI_WHO_BoundaryOverweightStart_ReturnsThuaCan()
        {
            // Arrange
            double bmi = 25.0; // WHO boundary: bắt đầu phạm vi "Thừa cân"
            string expected = "Thừa cân";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual,
                "TC17: BMI = 25.0 (WHO overweight threshold) should return 'Thừa cân'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("EP-Overweight")]
        public void TC18_ClassifyBMI_OverweightValue_ReturnsThuaCan()
        {
            // Arrange
            double bmi = 27.5; // Overweight BMI value
            string expected = "Thừa cân";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual, "TC18: Overweight BMI should return 'Thừa cân'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("BVA-Boundary")]
        public void TC19_ClassifyBMI_WHO_BoundaryObeseStart_ReturnsBeoXhi()
        {
            // Arrange
            double bmi = 30.0; // WHO boundary: bắt đầu phạm vi "Béo phì"
            string expected = "Béo phì";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual,
                "TC19: BMI = 30.0 (WHO obese threshold) should return 'Béo phì'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("EP-Obese")]
        public void TC20_ClassifyBMI_ObeseValue_ReturnsBeoXhi()
        {
            // Arrange
            double bmi = 35.0; // Obese BMI value
            string expected = "Béo phì";

            // Act
            string actual = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(expected, actual, "TC20: Obese BMI should return 'Béo phì'");
        }

        [TestMethod]
        [TestCategory("ClassifyBMI")]
        [TestCategory("EP-Invalid")]
        public void TC21_ClassifyBMI_NegativeBMI_ThrowsArgumentException()
        {
            // Arrange
            double bmi = -1.0; // Invalid: BMI âm
            bool exceptionThrown = false;
            string actualMessage = "";

            // Act
            try
            {
                _healthCalculator.ClassifyBMI(bmi);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                actualMessage = ex.Message;
            }

            // Assert
            Assert.IsTrue(exceptionThrown, "TC21: Should throw ArgumentException for negative BMI");
            Assert.IsTrue(actualMessage.Contains("BMI không thể âm"), "TC21: Exception message should mention BMI cannot be negative");
        }

        #endregion

        #region White Box Testing - Statement & Decision Coverage

        [TestMethod]
        [TestCategory("WhiteBox")]
        [TestCategory("StatementCoverage")]
        public void StatementCoverage_CalculateBMI_CoversAllStatements()
        {
            // Mục đích: Đảm bảo mỗi dòng code được thực thi ít nhất 1 lần

            // Path 1: Valid execution - covers main calculation logic
            double result1 = _healthCalculator.CalculateBMI(170, 70);
            Assert.IsTrue(result1 > 0, "Valid path should return positive BMI");

            // Path 2: Exception path - covers validation logic
            bool exceptionThrown = false;
            string exceptionMessage = "";

            try
            {
                _healthCalculator.CalculateBMI(0, 70);
            }
            catch (ArgumentException ex)
            {
                exceptionThrown = true;
                exceptionMessage = ex.Message;
            }

            Assert.IsTrue(exceptionThrown, "Should have thrown ArgumentException");
            Assert.IsTrue(exceptionMessage.Contains("Chiều cao"), "Exception message should mention height");
        }

        [TestMethod]
        [TestCategory("WhiteBox")]
        [TestCategory("DecisionCoverage")]
        public void DecisionCoverage_ClassifyBMI_CoversAllDecisions()
        {
            // Mục đích: Test tất cả các decision paths (if-else branches)

            // Decision 1: bmi < 0 -> TRUE path
            bool exceptionThrown = false;
            try
            {
                _healthCalculator.ClassifyBMI(-1);
            }
            catch (ArgumentException)
            {
                exceptionThrown = true;
            }
            Assert.IsTrue(exceptionThrown, "Should throw exception for negative BMI");

            // Decision 2: bmi < 18.5 -> TRUE path
            Assert.AreEqual("Thiếu cân", _healthCalculator.ClassifyBMI(18.0));

            // Decision 3: bmi < 25 -> TRUE path
            Assert.AreEqual("Bình thường", _healthCalculator.ClassifyBMI(22.0));

            // Decision 4: bmi < 30 -> TRUE path
            Assert.AreEqual("Thừa cân", _healthCalculator.ClassifyBMI(27.0));

            // Decision 5: else -> TRUE path
            Assert.AreEqual("Béo phì", _healthCalculator.ClassifyBMI(35.0));
        }

        #endregion

        #region Integration Test

        [TestMethod]
        [TestCategory("Integration")]
        public void Integration_CalculateBMI_And_ClassifyBMI_WorkTogether()
        {
            // Mục đích: Test sự tương tác giữa 2 methods

            // Arrange
            double height = 170; // cm
            double weight = 70;  // kg

            // Act
            double bmi = _healthCalculator.CalculateBMI(height, weight);
            string classification = _healthCalculator.ClassifyBMI(bmi);

            // Assert
            Assert.AreEqual(24.22, bmi, "BMI calculation should be correct");
            Assert.AreEqual("Bình thường", classification, "BMI classification should be correct");

            // Additional verification
            Assert.IsTrue(bmi >= 18.5 && bmi < 25, "BMI should be in normal range");
        }

        #endregion
    }
}