import { jest } from '@jest/globals';

// Mock Admission BEFORE importing the service
const mockCreate = jest.fn();
jest.unstable_mockModule('../Admission.model.mjs', () => ({
  default: { create: mockCreate },
}));

// Import modules after mocks
const { default: admissionService } = await import('../Admission.service.mjs');
const { default: AdmissionConstant } = await import(
  '../Admission.constant.mjs'
);

describe('Admission_Service', () => {
  describe('Create_Student', () => {
    let mockData;
    let mockCourse;
    let imageUrl;

    beforeEach(() => {
      jest.clearAllMocks();
      mockData = {
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        fatherName: 'Father Doe',
        motherName: 'Mother Doe',
        email: 'john@example.com',
        mobileNumber: '1234567890',
        dateOfBirth: '2000-01-01',
        gender: 'Male',
        nationality: 'Indian',
        contactNumber: '9999999999',
        Gname: 'Guardian',
        Grelation: 'Uncle',
        GcontactNumber: '8888888888',
        street: '123 Street',
        city: 'City',
        state: 'State',
        pinCode: '123456',
        AadharCardNumber: '111122223333',
        tenthMarks: 85,
        tenthBoard: 'CBSE',
        tenthGrade: 'A',
        twelfthMarks: 90,
        twelfthBoard: 'CBSE',
        twelfthGrade: 'A+',
        mode: 'Online',
        university: 'Test University',
      };
      mockCourse = { _id: 'course123' };
      imageUrl = 'http://image.url/avatar.png';
    });

    it('should create a student successfully', async () => {
      const mockAdmission = {
        _id: 'admission123',
        student: { firstName: 'John' },
      };
      mockCreate.mockResolvedValue(mockAdmission);

      const result = await admissionService.Create_Student({
        data: mockData,
        uniqueId: 'U123',
        course: mockCourse,
        image_Url: imageUrl,
      });

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAdmission);
    });

    it('should throw NOT_ADMITTED if create returns null', async () => {
      mockCreate.mockResolvedValue(null);

      await expect(
        admissionService.Create_Student({
          data: mockData,
          uniqueId: 'U123',
          course: mockCourse,
          image_Url: imageUrl,
        })
      ).rejects.toThrow(AdmissionConstant.NOT_ADMITTED);
    });

    it('should throw error if Admission.create throws', async () => {
      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(
        admissionService.Create_Student({
          data: mockData,
          uniqueId: 'U123',
          course: mockCourse,
          image_Url: imageUrl,
        })
      ).rejects.toThrow('DB Error');
    });
  });
});
