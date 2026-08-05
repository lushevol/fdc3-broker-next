const NAME_SPACE = '_55313_128_webkit_exp_api';

/**
 * Fetches a paginated list of comments for a given reference.
 * @param request - The GraphQL request function
 * @param params.page - Page number (default: 0)
 * @param params.referenceId - The reference item ID
 * @param params.size - Page size (default: 20)
 * @param params.sort - Sort field (default: '')
 * @param params.source - The source identifier (default: '')
 * @param params.view - View filter, e.g. "All" (default: 'All')
 * @returns Promise resolving to paginated comment list
 */
export const getComments = (request: any, params: {
    page?: number,
    referenceId: string,
    size?: number,
    sort?: string,
    source?: string,
    view?: string,
}) => {
    const { page = 0, referenceId, size = 20, sort = '', source = '', view = 'All' } = params;
    return new Promise((resolve, reject) => {
        request(`query {
          ${NAME_SPACE} {
            get_comments(page: ${page}, referenceId: "${referenceId}", size: ${size}, sort: "${sort}", source: "${source}", view: "${view}") {
                page
                size
                sort
                total
                view
                items {
                    content
                    createdDate
                    id
                    likedByCurrentUser
                    likes
                    mentions
                    parentId
                    referenceId
                    reminderTimeList
                    reported
                    saved
                    status
                    updatedDate
                    userId
                }
            }}
        }`)
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE]?.get_comments ?? {}))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Fetches a single comment by ID, with optional replies.
 * @param request - The GraphQL request function
 * @param id - The comment ID to retrieve
 * @param includeReplies - Whether to include nested replies (default: false)
 * @param source - The source identifier (default: '')
 * @returns Promise resolving to the comment object
 */
export const getComment = (request: any, id: string, includeReplies = false, source = '') => {
    return new Promise((resolve, reject) => {
        request(`query {
          ${NAME_SPACE} {
            get_comment(id: "${id}", includeReplies: ${includeReplies}, source: "${source}") {
                comment {
                    content
                    createdDate
                    id
                    likedByCurrentUser
                    likes
                    mentions
                    parentId
                    referenceId
                    reported
                    saved
                    status
                    updatedDate
                    userId
                }
            }}
        }`)
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].get_comment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Creates a new comment or reply under a reference item.
 * @param request - The GraphQL request function
 * @param params.mentions - Mentioned user IDs
 * @param params.parentId - Parent comment ID (for replies, optional)
 * @param params.referenceId - The reference item ID this comment belongs to
 * @param params.reminderTimeList - list of reminder datetime strings (default: [])
 * @param params.source - The source identifier (default: '')
 * @param params.text - The comment text content
 * @returns Promise resolving to the newly created comment object
 */
export const createComment = (request: any, params: {
    mentions: string[],
    parentId?: string,
    referenceId: string,
    reminderTimeList?: string[],
    source?: string,
    text: string,
}) => {
    const { mentions = [], parentId = '', referenceId, reminderTimeList = [], source = '', text } = params;
    return new Promise((resolve, reject) => {
        request(`mutation CreateComment($text: String!){
          ${NAME_SPACE} {
            post_createComment(
              mentions: [${mentions.map(t => `"${t}"`).join(', ')}]
              parentId: "${parentId}" 
              referenceId: "${referenceId}"
              reminderTimeList: [${reminderTimeList.map(t => `"${t}"`).join(', ')}]
              source: "${source}"
              text: $text
            ) {
                content
                createdDate
                id
                likedByCurrentUser
                likes
                mentions
                parentId
                referenceId
                reminderTimeList
                reported
                saved
                status
                updatedDate
                userId
        }}
        }`,
        { text }
        )
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].post_createComment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Updates the content, mentions, or reminder list of an existing comment.
 * @param request - The GraphQL request function
 * @param params.id - The ID of the comment to update
 * @param params.mentions - Updated mentioned user IDs (JSON stringified array)
 * @param params.source - The source identifier (default: '')
 * @param params.text - The updated comment text content
 * @param params.reminderTimeList - Updated list of reminder datetime strings (default: [])
 * @param params.status - Updated status of the comment (default: '')
 * @returns Promise resolving to the updated comment object
 */
export const updateComment = (request: any, params: {
    id: string,
    mentions: string[],
    source?: string,
    text: string,
    reminderTimeList?: string[],
    status?: string
}) => {
    const { id, mentions = [], source = '', text, reminderTimeList = [], status = '' } = params;
    return new Promise((resolve, reject) => {
        request(`mutation UpdateComment($text: String!){
          ${NAME_SPACE} {
            put_updateComment(
              id: "${id}"
              mentions: [${mentions.map(t => `"${t}"`).join(', ')}]
              source: "${source}"
              text: $text
              reminderTimeList: [${reminderTimeList.map(t => `"${t}"`).join(', ')}]
            ) {
                content
                createdDate
                id
                likedByCurrentUser
                likes
                mentions
                parentId
                referenceId
                reported
                saved
                status
                updatedDate
                userId
        }}
        }`,
        { text }
        )
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].put_updateComment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Adds a like to a comment on behalf of the current user.
 * @param request - The GraphQL request function
 * @param id - The ID of the comment to like
 * @param source - The source identifier (default: '')
 * @returns Promise resolving to updated likedByCurrentUser and likes count
 */
export const likeComment = (request: any, id: string, source = '') => {
    return new Promise((resolve, reject) => {
        request(`mutation {
          ${NAME_SPACE} {
            put_likeComment(id: "${id}", source: "${source}") {
                likedByCurrentUser
                likes
        }}
        }`)
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].put_likeComment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Removes the current user's like from a comment.
 * @param request - The GraphQL request function
 * @param id - The ID of the comment to unlike
 * @param source - The source identifier (default: '')
 * @returns Promise resolving to updated likedByCurrentUser and likes count
 */
export const unlikeComment = (request: any, id: string, source = '') => {
    return new Promise((resolve, reject) => {
        request(`mutation {
          ${NAME_SPACE} {
            put_unlikeComment(id: "${id}", source: "${source}") {
                likedByCurrentUser
                likes
        }}
        }`)
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].put_unlikeComment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};

/**
 * Permanently deletes a comment by ID.
 * @param request - The GraphQL request function
 * @param id - The ID of the comment to delete
 * @param source - The source identifier (default: '')
 * @returns Promise resolving to a success flag and message
 */
export const deleteComment = (request: any, id: string, source = '') => {
    return new Promise((resolve, reject) => {
        request(`mutation {
          ${NAME_SPACE} {
            delete_removeComment(id: "${id}", source: "${source}") {
                message
                success
        }}
        }`)
        .then((res: any) => res.json())
        .then((res: any) => res.errors ? reject(new Error(res.errors[0].message)) : resolve(res.data[NAME_SPACE].delete_removeComment))
        .catch((e: Error) => reject(new Error(e.message)));
    });
};