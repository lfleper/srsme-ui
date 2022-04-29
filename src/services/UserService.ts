import fetcher from "@/api/Api"
import { User } from "@/types"

export class UserService {
    public async updateUser(user: User): Promise<User | void> {
        return await fetcher<User>('PUT', '/user', user)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('can not update user')
                }
                return resp.data
            })
    }

    public async updateUserPassword(userId: string, password: string, confirmedPassword: string): Promise<void> {
        if (password !== confirmedPassword) {
            throw new Error('passwords do not match')
        }
        return await fetcher<void>('PUT', `/user/${userId}`, { password: password })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('can not update user password')
                }
            })
    }
}