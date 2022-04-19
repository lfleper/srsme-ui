import fetcher from "@/api/Api"
import { FlatDocument } from "@/types"

export class DocumentService {
    public async getFlatDocuments(): Promise<FlatDocument[] | void> {
        return await fetcher<FlatDocument[] | null>('GET', '/document/flatDocuments')
            .then(resp => {
                if (!resp.data) 
                    throw new Error ('error getting documents.')
                resp.data.map(d => {
                    d.lastModified = new Date(d.lastModified)
                    d.dateOfCreation = new Date(d.dateOfCreation)
                })
                return resp.data
            })
            .catch(err => {
                console.log(err)
            })
    }
}