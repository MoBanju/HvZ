
export interface IMission {
    id:number,
    game_id?:number,
    name:string,
    is_human_visible:boolean,
    is_zombie_visible:boolean,
    description?:string,
    start_time?:string,
    end_time?:string,
    longitude?:number,
    latitude?:number,
}



