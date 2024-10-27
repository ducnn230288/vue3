/**
 * Represents a common interface.
 * @interface
 * @name ICommon
 */
interface ICommon {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  isDisable?: boolean;
  isDelete?: boolean;
}
/**
 * Represents an IMCode object.
 * @interface
 * @extends ICommon
 */
export interface IMCode extends ICommon {
  code?: string;
  type?: string;
  typeCode?: string;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  item?: IMCodeType;
  users?: IMUser[];
}

/**
 * Represents a code type in the application.
 * @interface
 * @extends ICommon
 */
export interface IMCodeType extends ICommon {
  name: string;
  code: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: IMCode[];
}

/**
 * Represents the content of an item.
 * @interface
 * @extends ICommon
 */
export interface IMContent extends ICommon {
  name?: string;
  type?: string;
  typeCode?: string;
  imageUrl?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  item?: IContentType;
  languages?: {
    id: string;
    language?: string;
    name: string;
    description?: string;
    position?: string;
    content?: string;
    dataId?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
}

/**
 * Represents the interface for a content type.
 * @interface
 * @extends ICommon
 */
export interface IContentType extends ICommon {
  name: string;
  code: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: IMContent[];
}

/**
 * Represents a parameter for a model.
 * @interface
 * @extends ICommon
 */
export interface IMParameter extends ICommon {
  name?: string;
  code?: string;
  contentVi?: string;
  contentEn?: string;
  updatedAt?: string;
}

/**
 * Represents a post in the application.
 * @interface
 * @extends ICommon
 */
export interface IMPost extends ICommon {
  typeCode?: string;
  imageUrl?: string;
  type?: IMPostType;
  languages?: {
    language?: string;
    name: string;
    description?: string;
    slug: string;
    content?: string;
    postId?: string;
    post?: IMPost;
  }[];
}

/**
 * Represents the interface for a post type.
 * @interface
 * @extends ICommon
 */
export interface IMPostType extends ICommon {
  name: string;
  code: string;
  description: string;
  postTypeId: string;
  createdAt?: string;
  updatedAt?: string;
  items?: IMPost[];
  children?: IMPostType[];
}

/**
 * Represents a member for a project.
 * @interface
 * @extends ICommon
 */
export interface IMUser extends ICommon {
  name?: string;
  avatarUrl?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  birthday?: string;
  description?: string;
  positionCode?: string;
  position?: IMCode;
  retypedPassword?: string;
  roleCode?: string;
  role?: IMUserRole;
}

/**
 * Represents the model for a user role.
 * @interface
 * @extends ICommon
 */
export interface IMUserRole extends ICommon {
  name?: string;
  code?: string;
  isSystemAdmin?: boolean;
  permissions?: string[];
  users?: IMUser[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents the data structure for resetting a password.
 * @interface
 * @extends ICommon
 */
export interface IResetPassword {
  password?: string;
  retypedPassword?: string;
  passwordOld?: string;
  email?: string;
  otp?: string;
}
