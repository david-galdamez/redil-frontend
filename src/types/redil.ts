interface RedilDto {
  id: number;
  name: string;
  description: string;
  numCourse: number;
}

interface RedilListDto {
  id: number;
  name: string;
  numCourse: number;
}

interface RedilDetailsDto {
  id: number;
  name: string;
  description: string;
  redilCode: string;
  numCourse: number;
  teacherList: RedilTeacherList[];
}

interface RedilTeacherList {
  id: number;
  name: string;
  email: string;
}

interface RedilClassStatDto {
  name: string;
  groupName: string;
  rediles: string[];
  isServer: boolean;
  attendancePercentage: number;
}
