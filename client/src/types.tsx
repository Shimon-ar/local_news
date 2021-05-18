export type Source = {
    id: string,
    name: string
}

export type Article = {
    _id: number,
    category: string,
    source: Source,
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    global_id: string,
    isExternal: boolean
}

export type Article_data = {
    headline: string,
    subtitle: string,
    image: string,
    body: string[],
}

export type HomeData = {
    [key: string]: Article[],
}

export const Routes = {
    general: '/general',
    technology :'/technology',
    sport: '/sport',
    science: '/science',
    areaNews: '/areanews',
    home: '/home',
    publish: '/publish',
    article: '/article',
    login: '/login'
}

export type City = {
    name_he: string
}
