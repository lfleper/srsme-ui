export interface UserLogin {
    username: string,
    password: string
}

export interface UserRegistration {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string
}

export interface Token {
    tokenType: string,
    jwtToken: string,
    expiresIn: number
}

export interface DocumentFilter {
    searchString: string,
    sortBy: string
}

export interface FlatDocument {
    id: string,
    name: string,
    description: string,
    dateOfCreation: Date,
    lastModified: Date,
    users: DocumentUser[]
}

export interface DocumentUser {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    documentPermission: string
}

export interface User {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Role,
    enabled: boolean
}

export interface Role {
    id: string,
    role: string
}

export interface VuexData {
    user: User | undefined
}

export interface Chapter {
    title: string;
    content: string;
    chapterNo: number;
}

export interface Document extends FlatDocument {
    chapters: Chapter[]
}

export interface AddUserToDocumentDto {
    username: string,
    documentPermission: string
}