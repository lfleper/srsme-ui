import fetcher, { baseUrl } from "@/api/Api"
import { AddUserToDocumentDto, DocumentUser, FlatDocument } from "@/types"
import { TokenService } from "./TokenService"

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

    public async getFlatDocument(documentId: string): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument>('GET', `/document/${documentId}`)
            .then(resp => {
                if (!resp.data) 
                    throw new Error (`error getting document.`)
                resp.data.lastModified = new Date(resp.data.lastModified)
                resp.data.dateOfCreation = new Date(resp.data.dateOfCreation)
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

    public async updateDocumentUserPermission(documentId: string, documentUser: DocumentUser): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument>('PUT', `/document/${documentId}/user`, documentUser)
            .then(resp => {
                if (!resp.ok) 
                    throw new Error (`error updating document user permission.`)
                return resp.data
            })
    }

    public async deleteUserFromDocument(documentId: string, documentUser: DocumentUser): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument>('DELETE', `/document/${documentId}/user`, documentUser)
            .then(resp => {
                if (!resp.ok) 
                    throw new Error (`error deleting user from document.`)
                return resp.data
            })
    }

    public async addUserToDocument(documentId: string, newUser: AddUserToDocumentDto): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument>('POST', `/document/${documentId}/user`, newUser)
            .then(resp => {
                if (!resp.ok) 
                    throw new Error (`error adding user to document.`)
                return resp.data
            })
    }

    public async updateDocumentName(documentId: string, name: string): Promise<FlatDocument | void> {
        return await fetcher<FlatDocument>('PUT', `/document/${documentId}/${name}`)
            .then(resp => {
                if (!resp.ok) 
                    throw new Error (`error updating document name.`)
                return resp.data
            })
    }

    public getPdf(documentId: string): void {
        const token = new TokenService().getToken()
        const header = new Headers()
        if (token) {
            header.append('Authorization', token.tokenType + ' ' + token.jwtToken)
        }
        header.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: header
        }
        fetch(`${baseUrl}/document/${documentId}/pdf`, requestOptions)
            .then(resp => resp.blob())
            .then(blob => {
                const file = new Blob([blob], {type: 'application/pdf'})
                const fileUrl = URL.createObjectURL(file)
                window.open(fileUrl)
            })
    }
}