/**
 * @file storageUtils.js
 * @description Utility functions for managing application data using browser LocalStorage.
 * Handles CRUD operations for students, attendance, authentication, and schedules.
 */

// Keys used for storing data in localStorage
const STUDENTS_KEY = 'smartERP_students';
const LOGGED_IN_USER_KEY = 'smartERP_loggedInUser';
const FACE_VERIFIED_KEY = 'smartERP_faceVerified';
const ATTENDANCE_KEY = 'smartERP_attendance';

/**
 * Helper function to save data to localStorage.
 * @param {string} key - The localStorage key
 * @param {any} data - The data to store (will be JSON stringified)
 */
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Helper function to retrieve data from localStorage.
 * @param {string} key - The localStorage key
 * @returns {any} The parsed data from localStorage, or null if not found
 */
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// --- Schedule ---

// Hardcoded daily schedule for classes
const DAILY_SCHEDULE = [
  { id: 'cs101', name: 'Data Structures', time: '09:00 AM - 10:30 AM' },
  { id: 'cs102', name: 'Operating Systems', time: '11:00 AM - 12:30 PM' },
  { id: 'cs103', name: 'Web Development', time: '01:30 PM - 03:00 PM' },
  { id: 'cs104', name: 'Database Management', time: '03:30 PM - 05:00 PM' }
];

/**
 * Retrieves the daily class schedule.
 * @returns {Array} List of scheduled classes
 */
export const getDailySchedule = () => {
  return DAILY_SCHEDULE;
};


// --- Students ---

/**
 * Retrieves all registered students from storage.
 * @returns {Array} List of student objects
 */
export const getStudents = () => {
  return getData(STUDENTS_KEY) || [];
};

/**
 * Registers a new student and saves their data.
 * @param {Object} studentData - Data of the student to register
 * @throws {Error} If a student with the same email or roll number already exists
 */
export const saveStudent = (studentData) => {
  const students = getStudents();
  
  // Ensure we don't have duplicates by roll number or email
  const exists = students.some(
    (s) => s.rollNumber === studentData.rollNumber || s.email === studentData.email
  );
  
  if (exists) {
    throw new Error('Student with this email or roll number already exists.');
  }

  // Add new student with a creation timestamp
  students.push({
    ...studentData,
    createdAt: new Date().toISOString(),
  });
  
  saveData(STUDENTS_KEY, students);
};

/**
 * Updates an existing student's data.
 * @param {string} rollNumber - The roll number of the student to update
 * @param {Object} updatedData - The new data fields to merge
 * @returns {boolean} True if update was successful, false if student not found
 */
export const updateStudent = (rollNumber, updatedData) => {
    const students = getStudents();
    const index = students.findIndex(s => s.rollNumber === rollNumber);
    
    if(index !== -1) {
        // Merge existing student data with the updated data
        students[index] = { ...students[index], ...updatedData };
        saveData(STUDENTS_KEY, students);
        
        // If the updated student is currently logged in, update their session data too
        const loggedInUser = getLoggedInUser();
        if(loggedInUser && loggedInUser.rollNumber === rollNumber) {
             saveData(LOGGED_IN_USER_KEY, students[index]);
        }
        return true;
    }
    return false;
}

// --- Authentication & Session ---

/**
 * Authenticates a user with email and password.
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object|null} The user object if successful, null otherwise
 */
export const loginUser = (email, password) => {
  const students = getStudents();
  // Find matching user
  const user = students.find((s) => s.email === email && s.password === password);
  
  if (user) {
    saveData(LOGGED_IN_USER_KEY, user);
    saveData(FACE_VERIFIED_KEY, false); // Reset face verification status on new login
    return user;
  }
  return null;
};

/**
 * Logs out the current user by clearing session storage.
 */
export const logoutUser = () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  localStorage.removeItem(FACE_VERIFIED_KEY);
};

/**
 * Retrieves the currently logged-in user.
 * @returns {Object|null} The logged-in user object, or null if none
 */
export const getLoggedInUser = () => {
  return getData(LOGGED_IN_USER_KEY);
};

/**
 * Checks if the user has successfully passed face verification.
 * @returns {boolean} True if verified, false otherwise
 */
export const isFaceVerified = () => {
  return getData(FACE_VERIFIED_KEY) === true;
};

/**
 * Sets the face verification status for the current session.
 * @param {boolean} status - The verification status to set
 */
export const setFaceVerified = (status) => {
  saveData(FACE_VERIFIED_KEY, status);
};

// --- Attendance ---

/**
 * Retrieves all attendance records from storage.
 * @returns {Array} List of all attendance records
 */
export const getAttendanceRecords = () => {
  return getData(ATTENDANCE_KEY) || [];
};

/**
 * Marks a student as present for a specific class.
 * @param {Object} student - The student object marking attendance
 * @param {string} className - The name of the class
 * @returns {Object} The newly created attendance record
 * @throws {Error} If class is not selected or attendance already marked
 */
export const markAttendance = (student, className) => {
  if (!className) {
    throw new Error('Please select a class to mark attendance.');
  }

  const records = getAttendanceRecords();
  const today = new Date().toLocaleDateString();
  
  // Check if attendance is already marked for this class today to prevent duplicates
  const alreadyMarked = records.some(
    (r) => r.rollNumber === student.rollNumber && r.date === today && r.className === className
  );

  if (alreadyMarked) {
    throw new Error(`Attendance already marked for ${className} today`);
  }

  // Create new attendance record
  const newRecord = {
    rollNumber: student.rollNumber,
    name: student.fullName,
    className: className,
    date: today,
    time: new Date().toLocaleTimeString(),
    status: 'Present'
  };

  records.push(newRecord);
  saveData(ATTENDANCE_KEY, records);
  return newRecord;
};

/**
 * Processes absences for all students.
 * Automatically marks students as 'Absent' for any past classes they missed since registration.
 */
export const processAbsences = () => {
  const students = getStudents();
  const records = getAttendanceRecords();
  const schedule = getDailySchedule();
  
  // Set today's date to midnight for accurate day comparisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let updated = false;

  students.forEach(student => {
    // Start checking for absences from the student's registration date
    const registrationDate = new Date(student.createdAt);
    registrationDate.setHours(0, 0, 0, 0);

    // Loop through each day from registration until yesterday
    for (let d = new Date(registrationDate); d < today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString();
      
      // For each day, check every class in the daily schedule
      schedule.forEach(cls => {
        const hasRecord = records.some(r => 
          r.rollNumber === student.rollNumber && 
          r.date === dateStr && 
          r.className === cls.name
        );
        
        // If no record exists for that class on that day, mark as absent
        if (!hasRecord) {
          records.push({
            rollNumber: student.rollNumber,
            name: student.fullName,
            className: cls.name,
            date: dateStr,
            time: '--',
            status: 'Absent'
          });
          updated = true; // Flag that we made changes
        }
      });
    }
  });

  // Save only if new absence records were added
  if (updated) {
    saveData(ATTENDANCE_KEY, records);
  }
};

/**
 * Retrieves the attendance history for a specific student.
 * @param {string} rollNumber - The student's roll number
 * @returns {Array} List of attendance records for the given student
 */
export const getStudentAttendanceHistory = (rollNumber) => {
    const records = getAttendanceRecords();
    return records.filter(r => r.rollNumber === rollNumber);
};

/**
 * Helper to convert a standard array back to Float32Array format required by face-api.
 * @param {Array} descriptorArray - The array to convert
 * @returns {Float32Array|null} The converted Float32Array or null if input is falsy
 */
export const getFaceDescriptorArray = (descriptorArray) => {
  if (!descriptorArray) return null;
  return new Float32Array(descriptorArray);
};
