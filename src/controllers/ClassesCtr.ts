import { Request, Response } from 'express'
import db from '../database/connection'
import convertHoutToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

interface Filters {
    subject?: string;
    week_day?: string;
    time?: string;
}

export default class ClassesCtr {

    async index( req: Request, res: Response ) {

        const filters:Filters = req.query

        if( !filters.subject || !filters.week_day || !filters.time ) {

            return res.status( 400 ).json({ error: 'Missing filter classes' })
        }

        const timeinMinutes = convertHoutToMinutes(filters.time)
        
        const classes = await db('classes')
            .whereExists( function() {
                
                this.select( 'class_schedule.*' )
                .from( 'class_schedule' )
                .whereRaw( '`class_schedule`.`class_id` = `classes`.`id`' )
                .whereRaw( '`class_schedule`.`week_day` = ??`', [Number(filters.week_day)] )
                .whereRaw( '`class_schedule`.`from` <= ??`', [timeinMinutes] )
                .whereRaw( '`class_schedule`.`to` > ??`', [timeinMinutes] )
            } )
            .where( 'classes.subject', '=', filters.subject )
            .join( 'users', 'classes_id', '=', 'users.id' )
            .select([ 'classes.*', 'users.*' ])
        
        return res.json( classes )
    }

    async create( req: Request, res: Response ) {

        const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body
    
        const trx = await db.transaction();
    
        try {
       
            const insertedUsersIds = await trx('users').insert({
                name, avatar, whatsapp, bio
            })
        
            const user_id = insertedUsersIds[0]
        
            const insertedClassesIds = await trx('classes').insert({
                subject, cost, user_id
            })
        
            const class_id = insertedClassesIds[0]
        
            const classSchedule = schedule.map( (scheduleItem:ScheduleItem) => {
        
                return {
                    week_day: scheduleItem.week_day,
                    from: convertHoutToMinutes( scheduleItem.from ),
                    to: convertHoutToMinutes( scheduleItem.to ),
                    class_id
                }
            } )
        
            await trx('class_schedule').insert(classSchedule)
        
            await trx.commit()
        
            return res.status( 201 ).send()
    
        }catch( err ) {
    
            await trx.rollback()
    
            return res.status( 400 ).json({ error: 'Unexpected error while creating new class' })
        }
    }
}