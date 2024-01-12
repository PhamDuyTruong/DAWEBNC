import { writeFile, utils } from "xlsx";

const exportFile = (students, assignments, fileType = ".csv") => {
  const assignmentsTitle = assignments.map((assignment) => assignment.title);
  const headers = ["studentId", "fullname", ...assignmentsTitle];
  const data = students.map((student) => {
    const grades = student.grades.map((grade) => grade.grade);
    return [student.studentId, student.fullname, ...grades];
  });
  data.unshift(headers);
  const worksheet = utils.aoa_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Grade Board");
  writeFile(workbook, `grade-board${fileType}`);
};


export { exportFile };
