// src/utils/storageUtils.js

const STUDENTS_KEY = 'smartERP_students';
const LOGGED_IN_USER_KEY = 'smartERP_loggedInUser';
const FACE_VERIFIED_KEY = 'smartERP_faceVerified';
const ATTENDANCE_KEY = 'smartERP_attendance';

// Helper to save data to localStorage
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper to get data from localStorage
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// --- Students ---

export const getStudents = () => {
  return getData(STUDENTS_KEY) || [];
};

export const saveStudent = (studentData) => {
  const students = getStudents();
  // Ensure we don't have duplicates by roll number or email
  const exists = students.some(
    (s) => s.rollNumber === studentData.rollNumber || s.email === studentData.email
  );
  
  if (exists) {
    throw new Error('Student with this email or roll number already exists.');
  }

  students.push({
    ...studentData,
    createdAt: new Date().toISOString(),
  });
  saveData(STUDENTS_KEY, students);
};

export const updateStudent = (rollNumber, updatedData) => {
    const students = getStudents();
    const index = students.findIndex(s => s.rollNumber === rollNumber);
    
    if(index !== -1) {
        students[index] = { ...students[index], ...updatedData };
        saveData(STUDENTS_KEY, students);
        
        // if this is the logged in user, update that too
        const loggedInUser = getLoggedInUser();
        if(loggedInUser && loggedInUser.rollNumber === rollNumber) {
             saveData(LOGGED_IN_USER_KEY, students[index]);
        }
        return true;
    }
    return false;
}

// --- Authentication & Session ---

export const loginUser = (email, password) => {
  const students = getStudents();
  const user = students.find((s) => s.email === email && s.password === password);
  
  if (user) {
    saveData(LOGGED_IN_USER_KEY, user);
    saveData(FACE_VERIFIED_KEY, false); // Must verify face next
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  localStorage.removeItem(FACE_VERIFIED_KEY);
};

export const getLoggedInUser = () => {
  return getData(LOGGED_IN_USER_KEY);
};

export const isFaceVerified = () => {
  return getData(FACE_VERIFIED_KEY) === true;
};

export const setFaceVerified = (status) => {
  saveData(FACE_VERIFIED_KEY, status);
};

// --- Attendance ---

export const getAttendanceRecords = () => {
  return getData(ATTENDANCE_KEY) || [];
};

export const markAttendance = (student) => {
  const records = getAttendanceRecords();
  const today = new Date().toLocaleDateString();
  
  // Check if already marked today
  const alreadyMarked = records.some(
    (r) => r.rollNumber === student.rollNumber && r.date === today
  );

  if (alreadyMarked) {
    throw new Error('Attendance already marked today');
  }

  const newRecord = {
    rollNumber: student.rollNumber,
    name: student.fullName,
    date: today,
    time: new Date().toLocaleTimeString(),
    status: 'Present'
  };

  records.push(newRecord);
  saveData(ATTENDANCE_KEY, records);
  return newRecord;
};

export const processAbsences = () => {
  const students = getStudents();
  const records = getAttendanceRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let updated = false;

  students.forEach(student => {
    // Start checking from registration date
    const registrationDate = new Date(student.createdAt);
    registrationDate.setHours(0, 0, 0, 0);

    // Loop through each day from registration until yesterday
    for (let d = new Date(registrationDate); d < today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString();
      
      // Check if there is any record (Present or Absent) for this student on this date
      const hasRecord = records.some(r => r.rollNumber === student.rollNumber && r.date === dateStr);
      
      if (!hasRecord) {
        records.push({
          rollNumber: student.rollNumber,
          name: student.fullName,
          date: dateStr,
          time: '--',
          status: 'Absent'
        });
        updated = true;
      }
    }
  });

  if (updated) {
    saveData(ATTENDANCE_KEY, records);
  }
};

export const getStudentAttendanceHistory = (rollNumber) => {
    const records = getAttendanceRecords();
    return records.filter(r => r.rollNumber === rollNumber);
};

// Helper: Convert array back to Float32Array for face-api
export const getFaceDescriptorArray = (descriptorArray) => {
  if (!descriptorArray) return null;
  return new Float32Array(descriptorArray);
};
