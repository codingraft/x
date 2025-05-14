export type User = {
  _id: string;
  username: string;
  profileImg: string;
  fullName: string;
}
type Comment = {
  _id?: string;
  user?: User;
  text?: string;
};

export interface Posts {
  _id: string;
  user: User;
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
}

export interface SignupUserData {
  username: string;
  fullName: string;
  email: string;
  password: string;
}
export interface LoginUserData {
  username: string;
  password: string;
}

export interface AuthUser {
    username: string;
    fullName: string;
    profileImg?: string;
  }

  export interface PostType {
    _id: string;
    user: User;
    text: string;
    img?: string;
    likes: string[];
    comments: Comment[];
  }

  export interface SuggestedUser {
    _id: string;
    username: string;
    profilePicture: string;
    fullName: string;
  }