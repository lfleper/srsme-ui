import fetcher from "@/api/Api"
import { Chapter, FlatChapter } from "@/types"

export class ChapterService {
    public async getFlatChapters(documentId: string): Promise<FlatChapter[] | void> {
        return await fetcher<FlatChapter[] | null>('GET', `/document/${documentId}/chapters`)
            .then(resp => {
                if (!resp.data) 
                    throw new Error ('error getting chapters.')
                return resp.data
            })
    }
    public async deleteChapter(documentId: string, chapterId: string): Promise<void> {
        return await fetcher<void>('DELETE', `/document/${documentId}/chapters/${chapterId}`)
            .then(resp => {
                if (!resp.ok)
                    throw new Error (`error deleting chapter ${chapterId}.`)
            })
    }
    public async updateChaperName(documentId: string, chapterId: string, newName: string): Promise<FlatChapter | void> {
        return await fetcher<FlatChapter | null>('PUT', `/document/${documentId}/chapters/${chapterId}/${newName}`)
            .then(resp => {
                if (!resp.data)
                    throw new Error (`error updating chapter ${chapterId}.`)
                return resp.data
            })
    }
    public async getChapter(documentId: string, chapterId: string): Promise<Chapter | void> {
        return await fetcher<Chapter | null>('GET', `/document/${documentId}/chapters/${chapterId}`)
            .then(resp => {
                if (!resp.data)
                    throw new Error (`error getting chapter ${chapterId}.`)
                return resp.data
            })
    }
    public async saveChapterContent(documentId: string, chapterId: string, content: string | undefined): Promise<FlatChapter | void> {
        if (!content)
            content = ''
        console.log(content)
        return await fetcher<void>('PUT', `/document/${documentId}/chapters/${chapterId}`, content as string)
            .then(resp => {
                if (!resp.ok)
                    throw new Error (`error saving chapter ${chapterId}.`)
                return resp.data
            })
    }
    public async createChapter(documentId: string, chapterName: string, chapterNr: number): Promise<FlatChapter | void> {
        return await fetcher<FlatChapter | null>('POST', `/document/${documentId}/chapters`, {
            title: chapterName,
            description: '',
            nr: chapterNr
        })
            .then(resp => {
                if (!resp.data)
                    throw new Error (`error creating chapter ${chapterName}.`)
                return resp.data
            })
    }
    public async updateChapterNr(documentId: string, flatChapter: FlatChapter[]): Promise<FlatChapter[] | void> {
        return await fetcher<FlatChapter[] | null>('PUT', `/document/${documentId}/flatChapters`, flatChapter)
            .then(resp => {
                if (!resp.data)
                    throw new Error (`error updating chapter.`)
                return resp.data
            })
    }
}