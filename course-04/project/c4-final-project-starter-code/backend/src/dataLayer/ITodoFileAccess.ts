/**
 * ITodoDataAccess interface defines all the behaviors a to-do data access class should provide
 * This is useful if the data store used for the todos is changed in the future, or if we move
 * to another cloud providers
 */
export interface ITodoFileAccess {

    /**
     * provides a signed url to upload a file for the input todoId
     *
     * @param todoId the todoID for which an attachment is to be added
     */
    getSignedPutUrl(todoId: string): string

    /**
     * provides a signed url to download a file for the input todoId
     *
     * @param todoId the todoId for which an attachment is to be downloaded
     */
    getSignedGetUrl(todoId: string): string

    /**
     * deletes an attachment for the input todoId
     *
     * @param todoId todoId for which an attachment is to be deleted
     */
    deleteAttachment(todoId: string)
}
