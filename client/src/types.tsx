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
    isExternal: boolean,
    image_name: string,
    status: string
}

export type Msg = {
    isNew: boolean,
    to: string,
    content: string,
    time: string,
    _id: number
}

export type Article_data = {
    headline: string,
    subtitle: string,
    image: string,
    body: string[],
    isExternal: boolean,
    date: string
}

export type User = {
    name: string,
    id: number,
    is_manager: boolean
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
    login: '/login',
    confirmArticle: '/confirmArticle',
    favorites: '/favorites',
    myArticles: '/myArticles'
}

export type City = {
    name_he: string
}

export const CATEGORY = new Map([
    ['technology', 'טכנלוגיה'],
    ['sports', 'ספורט'],
    ['science', 'מדע'],
    ['general', 'כללי']
]);

export const STATUS = new Map([
    ['APPROVED', 'מאושר'],
    ['UNAPPROVED', 'לא מאושר'],
    ['PENDING', 'ממתין'],
]);

export const APPROVED = 'APPROVED';
export const UNAPPROVED = 'UNAPPROVED';
