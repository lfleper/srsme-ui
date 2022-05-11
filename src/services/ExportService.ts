import StarterKit from "@tiptap/starter-kit"
import { Editor, JSONContent } from "@tiptap/vue-3"
import { Image } from "@tiptap/extension-image"
import { ChapterService } from "./ChapterService"
import { FlatChapter } from "@/types"

export class ExportService {
    private editor: Editor
    private chapterService: ChapterService
    private documentContent = ''

    constructor() {
        this.chapterService = new ChapterService()
        this.editor = new Editor({
            content: '',
            extensions: [
                StarterKit.configure({
                    history: false,
                }),
                Image.configure({
                    inline: true,
                    allowBase64: true
                })
            ]
        })
    }

    /**
     * Loads all dependencies and adds all content to the editor.
     * 
     * @param docId Document ID from which the content is to be loaded.
     */
    public async loadDocument(docId: string): Promise<void> {
        const flatChapters: FlatChapter[] | void = await this.chapterService.getFlatChapters(docId)
        if (!flatChapters) {
            throw new Error('No chapters found')
        }
        let content = ''
        for (const flatChapter of flatChapters) {
            const chapter = await this.chapterService.getChapter(docId, flatChapter.id)
            content += '<h1>' + flatChapter.name + '</h1>'
            content += chapter?.content
        }
        this.documentContent = content
        this.editor.commands.setContent(this.documentContent)
    }
    public getHtml(): string {
        return this.editor.getHTML()
    }
    public getJson(): JSONContent {
        return this.editor.getJSON()
    }
    public getDocumentContent(): string {
        return this.documentContent
    }
}