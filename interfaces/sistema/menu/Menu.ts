export default interface Menu {

  texto: string;
  icone?: string;
  svgIcone?: string;
  link: string;
  subMenus: Menu[]

}