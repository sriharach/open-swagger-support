const apiQuality = [
    {
        name: 'Get',
        path: 'get'
    },
    {
        name: 'Post',
        path: 'post'
    },
    {
        name: 'Put',
        path: 'put'
    },
    {
        name: 'Delete',
        path: 'delete'
    },
    {
        name: 'Patch',
        path: 'patch'
    }
]

export type ApiQuality = typeof apiQuality

export default apiQuality