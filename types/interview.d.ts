export interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string | Date;
  userId: string;
}