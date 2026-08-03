import { downloadFile } from './data-export-utils.js';

export class CsvExporter {
  static escapeCsvValue(value: any, delimiter = ','): string {
    const strValue = String(value || '');
    const needsEscaping = strValue.includes(delimiter) || strValue.includes('"') ||
                         strValue.includes('\n') || strValue.includes('\r');

    return needsEscaping ? `"${strValue.replace(/"/g, '""')}"` : strValue;
  }

  static async exportToCsv(
    fileName: string,
    header: string[],
    data: Record<string, any>[],
    csvDelimiter = ','
  ): Promise<void> {
    const encoder = new TextEncoder();
    const escapeValue = (v: any) => this.escapeCsvValue(v, csvDelimiter);

    const stream = new ReadableStream({
      start(controller) {
        const csvHeader = `${header.map(escapeValue).join(csvDelimiter)}\n`;
        controller.enqueue(encoder.encode(csvHeader));

        data.forEach(row => {
          const csvRow = `${Object.values(row).map(escapeValue).join(csvDelimiter)}\n`;
          controller.enqueue(encoder.encode(csvRow));
        });

        controller.close();
      },
    });

    const response = new Response(stream, {
      headers: { 'Content-Type': 'text/csv' },
    });

    downloadFile(await response.blob(), fileName);
  }
}
