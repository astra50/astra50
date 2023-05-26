import {FieldPolicy} from '@apollo/client'
import dayjs, {Dayjs, isDayjs} from 'dayjs'

export const dateTypePolicy: FieldPolicy<Dayjs, string> = {
    merge: (_, incoming) => {
        return isDayjs(incoming) ? incoming : dayjs(incoming)
    },
}
