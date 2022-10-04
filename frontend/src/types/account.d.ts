export type Token = { _id?: string; token: string; createdAt: string; tableData?: { id: number } };

export type Profile = {
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  gravatar: string;
  lastName: string;
  tokens: Token[];
};
