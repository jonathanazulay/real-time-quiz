export interface PollResult {
    [text: string]: number
}

export interface Poll {
    id: string
    text: string
    result: PollResult
    activeVote: string | null
}