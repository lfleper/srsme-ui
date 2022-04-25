import { TokenService } from "@/services/TokenService"

const baseUrl = 'http://localhost:8080'

export default async function fetcher<TResult>(method: string, url: string, data?: unknown): Promise<Response<TResult>> {
    const tokenService = new TokenService()
    const headers: HeadersInit = {
        'content-type': 'application/json',
        Accept: 'application/json'
    }

    const token = tokenService.getToken()
    if (token) {
        headers.Authorization = token.tokenType + ' ' + token.jwtToken
    }

    const resp = await fetch(baseUrl + url, {
        method,
        cache: 'no-cache',
        headers,
        body: JSON.stringify(data)
    })

    let respData
    try {
        respData = await resp.json()
    } catch (err) {
        if (!resp.ok) {
            return Promise.reject({
                ok: resp.ok,
                status: resp.status,
                headers: resp.headers,
                data: undefined
            })
        }
    }

    return {
        ok: resp.ok,
        status: resp.status,
        headers: resp.headers,
        data: respData
    } as Response<TResult>
}


export interface Response<TResult> {
    ok: boolean,
    status: number,
    headers: unknown,
    data: TResult | undefined
}