export const API_URLS = {
    account: {
        login: 'account/login',
        register: 'account/register',
    },
    members: {
        list: 'users'
    },
    likes: {
        list: 'likes'
    },
    messages: {
        list: 'messages',
        thread: 'messages/thread/'
    },
    admin: {
        users: 'admin/users-with-roles',
    },
    errors: {
        notFound: 'buggy/not-found',
        badRequest: 'buggy/bad-request',
        serverError: 'buggy/server-error',
        noAuth: 'buggy/auth'
    }
}