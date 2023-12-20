export enum Role{
    User = 'user',
    Model = 'model'
}

export interface Conversation{
    role: Role,
    parts: string
}

export interface AskRequest{
    history : Conversation[],
    ask: string
}