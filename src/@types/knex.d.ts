import { Knex } from 'knex'

declare module 'knexs/types/tables' {
    export interface Tables {
        transactions: {
            id: string;
            title:string;
            amount:number;
            created_at:string;
            session_id?:string;
        }
    }
}