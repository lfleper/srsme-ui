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
}