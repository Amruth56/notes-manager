import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "cr" | "professor";
  organization: string;
}

export interface IBranch extends Document {
  name: string;
}

export interface ISemester extends Document {
  number: number;
  branchId: Types.ObjectId | string;
}

export interface ISubject extends Document {
  name: string;
  semesterId: Types.ObjectId | string;
}

export interface INote extends Document {
  title: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  subjectId: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;
  isPersonal: boolean;
  createdAt: Date;
}
