
export enum InputTipos{

  'texto',
  'numero',
  'areaTexto',
  'slider',
  'email',
  'senha', 
  'combobox',
  'radio',
  'switch',
  'checkbox',
  'data',
  'telefone'
}

export interface Input{
  
  nome: string;
  label: string;
  valorPadrao?: any;
  tipo: InputTipos;
  obrigatorio: boolean;
  tamanho?: {
    minimo?: number,
    maximo?: number
  };
  opcoes?: {valor: any, texto: any}[];
  multiSelect?: boolean;
  confirmarSenha?: boolean;

}

export interface ItemLista{

  titulo: string;
  campoObjeto: string;

}

export interface ApiMetodos{

  create?: string;
  delete?: string;
  update?: string;
  findOne?: string;
  findAll?: string;
  findSearch?: string;

}

export interface Crud{

  titulo: string;
  inputs: Input[];
  apiUrl: string;
  api?: ApiMetodos;
  lista?: ItemLista[];
  campoId: string;

}