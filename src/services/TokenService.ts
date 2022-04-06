import { Token } from "@/types"
import { useCookies } from "vue3-cookies"

/**
 * Service to manage the jwt token.
 */
export class TokenService {
    private readonly TOKEN_COOKIE_NAME = 'token'

    public isAuthenticated(): boolean {
        return this.getToken() !== null
    }

    public getToken(): Token | null {
        const cookieManager = useCookies()
        const cookie = cookieManager.cookies.get(this.TOKEN_COOKIE_NAME)
        return cookie ? JSON.parse(JSON.stringify(cookie)) : null
    }

    public setToken(token: Token): void {
        const cookieManager = useCookies()
        cookieManager.cookies.set(this.TOKEN_COOKIE_NAME, JSON.stringify(token), token.expiresIn)
    }

    public removeToken(): void {
        const cookieManager = useCookies()
        cookieManager.cookies.remove(this.TOKEN_COOKIE_NAME)
    }
}