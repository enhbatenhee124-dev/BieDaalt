export interface Material {
  id: number;
  title: string;
  fileUrl: string;
  fileType?: string;
  classGroupId: number;
  uploadedById: number;
  createdAt?: Date;
}
