
export class Chat{
  public name: string;
  public lastMsg: string;
  public imagePath: string;

  constructor(name:string,lastMsg:string,imagePath:string)
  {
    this.name=name
    this.lastMsg=lastMsg
    this.imagePath=imagePath
  }
}
