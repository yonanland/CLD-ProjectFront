export default interface INote{
  _id?:string,
  title?: string,
  content: string,
  owner_id?: string
  sharedWith?:[string],
  images?: [string]
}


