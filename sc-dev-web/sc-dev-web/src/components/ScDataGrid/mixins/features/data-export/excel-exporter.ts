import * as XLSX from 'xlsx-republish';
import { downloadFile } from './data-export-utils.js';

type Attributes = Record<string, Record<string, any>>;

type TagHandler<T extends Attributes> = {
  // Function to identify if the tag is present in the cell value
  identify: (value: string) => boolean
  // Function to strip the tag from the cell value
  strip: (value: string) => string
  // Function to extract attributes from tag string
  attribute: (value: string) => T
  // Function to apply attributes during export to excel specific features
  apply: (sheet: XLSX.WorkSheet, address: string, attributes: T) => void
};

type TExcelExporter<T extends Attributes> = {
  handlers: {
    [key in keyof T]: TagHandler<T[key]>
  }
}

// Define tags to preserve during export
type PreserveTags = {
  'sc-link': {
    target: string;
    tooltip?: string;
  },
  'sc-title': {
    size: number;
  },
  'sc-paragraph': {
    size: number;
  },
  b: Record<string, never>,
  i: Record<string, never>,
}

class ExcelExporter implements TExcelExporter<PreserveTags> {
  handlers = {
    'sc-link': {
      identify: (value: string) => /<sc-link[^>]*href="[^"]*"[^>]*>/i.test(value),
      strip: (value: string) => value.replace(/<sc-link[^>]*>(.*?)<\/sc-link>/i, '$1'),
      attribute: (value: string) => {
        const attrs: PreserveTags['sc-link'] = { target: '' };
        const hrefMatch = value.match(/href="([^"]*)"/i);
        if (hrefMatch) {
          attrs.target = hrefMatch[1];
        }
        const titleMatch = value.match(/title="([^"]*)"/i);
        if (titleMatch) {
          attrs.tooltip = titleMatch[1];
        }
        return attrs;
      },
      apply: (sheet: XLSX.WorkSheet, address: string, attributes: PreserveTags['sc-link']) => {
        sheet[address].l = {
          Target: attributes.target,
          Tooltip: attributes.tooltip,
        };

        if (!sheet[address].s) {
          sheet[address].s = {};
        }

        if (!sheet[address].s.font) {
          sheet[address].s.font = {};
        }

        sheet[address].s.font.bold = true;
        sheet[address].s.font.color = { rgb: 'FF0000FF' };
      },
    },
    'sc-paragraph': {
      identify: (value: string) => /<sc-paragraph[^>]*>/i.test(value),
      strip: (value: string) => value.replace(/<sc-paragraph[^>]*>(.*?)<\/sc-paragraph>/i, '$1'),
      attribute: (value: string) => {
        const attrs: PreserveTags['sc-paragraph'] = { size: 10 };
        const sizeMatch = value.match(/size="([^"]*)"/i);
        if (sizeMatch) {
          const size = sizeMatch[1];
          const sizeMap: { [key: string]: number } = {
            xs: 10, sm: 12, md: 14, lg: 16,
          };
          attrs.size = sizeMap[size] || sizeMap.md;
        }
        return attrs;
      },
      apply: (sheet: XLSX.WorkSheet, address: string, attributes: PreserveTags['sc-paragraph']) => {
        if (!sheet[address].s) sheet[address].s = {};
        if (!sheet[address].s.font) sheet[address].s.font = {};
        sheet[address].s.font.sz = attributes.size;
        sheet[address].s.font.bold = true;
      },
      },
    'sc-title': {
      identify: (value: string) => /<sc-title[^>]*>/i.test(value),
      strip: (value: string) => value.replace(/<sc-title[^>]*>(.*?)<\/sc-title>/i, '$1'),
      attribute: (value: string) => {
        const attrs: PreserveTags['sc-title'] = { size: 10 };
        const levelMatch = value.match(/level="([^"]*)"/i);
        if (levelMatch) {
          const level = levelMatch[1];
          const sizeMap: { [key: string]: number } = {
            1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8,
          };
          attrs.size = sizeMap[level] || sizeMap['1'];
        }
        return attrs;
      },
      apply: (sheet: XLSX.WorkSheet, address: string, attributes: PreserveTags['sc-title']) => {
        if (!sheet[address].s) sheet[address].s = {};
        if (!sheet[address].s.font) sheet[address].s.font = {};
        sheet[address].s.font.bold = true;
        sheet[address].s.font.sz = attributes.size;
      },
    },
    b: {
      identify: (value: string) => /<b>.*?<\/b>/i.test(value),
      strip: (value: string) => value.replace(/<b>(.*?)<\/b>/i, '$1'),
      attribute: () => ({}),
      apply: (sheet: XLSX.WorkSheet, address: string) => {
        if (!sheet[address].s) sheet[address].s = {};
        if (!sheet[address].s.font) sheet[address].s.font = {};
        sheet[address].s.font.bold = true;
      },
    },
    i: {
      identify: (value: string) => /<i>.*?<\/i>/i.test(value),
      strip: (value: string) => value.replace(/<i>(.*?)<\/i>/i, '$1'),
      attribute: () => ({}),
      apply: (sheet: XLSX.WorkSheet, address: string) => {
        if (!sheet[address].s) sheet[address].s = {};
        if (!sheet[address].s.font) sheet[address].s.font = {};
        sheet[address].s.font.italic = true;
      },
    },
  };

  private processCell(cell: string, rowIndex: number, colIndex: number, dataAttributes: { [key: string]: Attributes[] }): string {
    let processedCell = cell;
    for (const handlerKey in this.handlers) {
      const handler = this.handlers[handlerKey as keyof PreserveTags];
      if (handler.identify(processedCell)) {
        const attributes = handler.attribute(processedCell);
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        if (!dataAttributes[cellAddress]) dataAttributes[cellAddress] = [];
        dataAttributes[cellAddress].push({ [handlerKey]: attributes });
        processedCell = handler.strip(processedCell);
      }
    }
    return processedCell;
  }

  async exportToXlsx(
    fileName: string,
    header: any[],
    data: Record<string, any>[]
  ): Promise<void> {
    const dataAttributes: { [key: string]: Attributes[] } = {};

    const processedHeader = header.map((headerCell, colIndex) =>
      typeof headerCell === 'string'
        ? this.processCell(headerCell, 0, colIndex, dataAttributes)
        : headerCell
    );

    const worksheetData: any[][] = [processedHeader];

    for (let i = 0; i < data.length; i += 1) {
      const row = Object.values(data[i]).map((cell, colIndex) =>
        typeof cell === 'string'
          ? this.processCell(cell, i + 1, colIndex, dataAttributes)
          : cell
      );
      worksheetData.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    for (const cellAddress in dataAttributes) {
      const attributesList = dataAttributes[cellAddress];
      for (const attributes of attributesList) {
        for (const key in attributes) {
          const handler = ExcelExporterInstance.handlers[key as keyof PreserveTags];
          handler.apply(worksheet, cellAddress, attributes[key] as any);
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);
    const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer', cellStyles: true });

    const blob = new Blob([xlsxBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    downloadFile(blob, fileName);
  }
}

export const ExcelExporterInstance = new ExcelExporter();
