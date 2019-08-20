
export class FileCarte {

  public name: string;
  public file: boolean;
  public stat: { mode: number, size: number, atimeMs: number, ctimeMs: number, mtimeMs: number, birthtimeMs: number };
  public files?: Array<FileCarte>;
  public directory: boolean;
  public filesCount?: number;
  public symbolicLink: boolean;
  public symbolicLinkTarget?: string;

}