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
    }

    public async createDocument(name: string, description?: string): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument | null>('POST', '/document', { name: name, description: description })
            .then(resp => {
                if (!resp.data) 
                    throw new Error ('error creating document.')
                resp.data.lastModified = new Date(resp.data.lastModified)
                resp.data.dateOfCreation = new Date(resp.data.dateOfCreation)
                return resp.data
            })
    }

    public async deleteDocument(id: string): Promise<void> {
        return await fetcher<void>('DELETE', `/document/${id}`)
            .then(resp => {
                if (!resp.ok) 
                    throw new Error (`error deleting document ${id}.`)
            })
    }
}