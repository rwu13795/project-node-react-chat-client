import txt_icon from "../../images/file-icons/txt_icon.png";
import docx_icon from "../../images/file-icons/docx_icon.png";
import pdf_icon from "../../images/file-icons/pdf_icon.png";
import pptx_icon from "../../images/file-icons/pptx_icon.png";
import xlsx_icon from "../../images/file-icons/xlsx_icon.png";

export interface FileIcons {
  txt: string;
  doc: string;
  pdf: string;
  ppt: string;
  xls: string;
}

export function getFileIcon(fileIcons: FileIcons, extension?: string) {
  let file_icon = "";

  switch (extension) {
    case "pdf":
      file_icon = fileIcons.pdf;
      break;
    case "txt":
      file_icon = fileIcons.txt;
      break;
    case "doc":
    case "docx":
    case "docm":
      file_icon = fileIcons.doc;
      break;
    case "xls":
    case "xlsx":
      file_icon = fileIcons.xls;
      break;
    case "ppt":
    case "pptx":
      file_icon = fileIcons.ppt;
      break;
  }

  return file_icon;
}
