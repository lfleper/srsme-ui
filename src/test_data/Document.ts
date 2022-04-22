import { Document } from "@/types"

export const test_doc: Document = {
    id: "1",
    name: "Document 1",
    dateOfCreation: new Date(),
    lastModified: new Date(),
    user: [
        {
            id: "1",
            username: "user1",
            firstName: "User",
            lastName: "One",
            privilges: "user"
        }
    ],
    chapters: [
        {
            title: "Chapter 1",
            content: "Content 1",
            chapterNo: 1
        },
        {
            title: "Chapter 2",
            content: "Content 2",
            chapterNo: 2
        },
        {
            title: "Chapter 3",
            content: "Content 3",
            chapterNo: 3
        },
        {
            title: "Chapter 4",
            content: "Content 4",
            chapterNo: 4
        },
        {
            title: "Chapter 5",
            content: "Content 5",
            chapterNo: 5
        }
    ]
}