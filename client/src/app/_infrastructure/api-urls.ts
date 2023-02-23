export const API_URLS = {
    baseUrl: 'https://localhost:7001/api/',
    account: {
        login: 'account/login',
        register: 'account/register',
    },
    users: {
        list: 'users'
    },
    errors: {
        notFound: 'buggy/not-found',
        badRequest: 'buggy/bad-request',
        serverError: 'buggy/server-error',
        noAuth: 'buggy/auth'
    }
}