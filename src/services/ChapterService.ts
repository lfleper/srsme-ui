import fetcher from "@/api/Api"
import { FlatChapter } from "@/types"

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
}