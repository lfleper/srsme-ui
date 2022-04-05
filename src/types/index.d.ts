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