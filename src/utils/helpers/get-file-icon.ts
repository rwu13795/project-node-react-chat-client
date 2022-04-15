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
