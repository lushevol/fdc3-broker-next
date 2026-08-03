import { CalendarMetadata } from './ScCalendar.js';

function getCalendarColor(
  metadata: CalendarMetadata | undefined,
  fallbackColorKey: string,
  colorClassMapping: any
): { fill: string; stroke: string } {
  if (!metadata) {
    return colorClassMapping[fallbackColorKey] || colorClassMapping.default;
  }

  if (metadata.color && metadata.color !== 'auto') {
    const colorKey = metadata.color.toLowerCase();
    if (colorClassMapping[colorKey]) {
      return colorClassMapping[colorKey];
    }
  }

  return colorClassMapping[fallbackColorKey] || colorClassMapping.default;
}

export function assignCalendarColors(
  calendarKeys: string[],
  metadataMap: Map<string, CalendarMetadata>,
  colorMapping: any,
  colorClassMapping: any
): void {
  if (calendarKeys.length === 0) {
    return;
  }

  const colorKeys = Object.keys(colorClassMapping).filter(key => key !== 'default');
  
  const usedColors = new Set<string>();
  const explicitColorAssignments: Array<{ key: string; name: string; metadata: CalendarMetadata | undefined }> = [];
  const autoColorAssignments: Array<{ key: string; name: string; metadata: CalendarMetadata | undefined }> = [];
  
  calendarKeys.forEach(key => {
    const [, name] = key.split('-');
    const metadata = metadataMap.get(key);
    
    const hasExplicitColor = metadata?.color && metadata.color !== 'auto';
    if (hasExplicitColor) {
      explicitColorAssignments.push({ key, name, metadata });
      
      if (metadata?.color && metadata.color !== 'auto') {
        const colorKey = metadata.color.toLowerCase();
        if (colorClassMapping[colorKey]) {
          usedColors.add(colorKey);
        }
      }
    } else {
      autoColorAssignments.push({ key, name, metadata });
    }
  });
  
  explicitColorAssignments.forEach(({ name, metadata }) => {
    colorMapping[name] = getCalendarColor(metadata, 'default', colorClassMapping);
  });
  
  const availableColors = colorKeys.filter(color => !usedColors.has(color));
  let autoColorIndex = 0;
  
  autoColorAssignments.forEach(({ name, metadata }) => {
    if (name === 'Calendar' && (!metadata?.hexColor && metadata?.color === 'auto')) {
      colorMapping[name] = colorClassMapping.default;
    } else {
      const fallbackColorKey = availableColors.length > 0
        ? availableColors[autoColorIndex % availableColors.length]
        : colorKeys[autoColorIndex % colorKeys.length];
      autoColorIndex++;
      colorMapping[name] = getCalendarColor(metadata, fallbackColorKey, colorClassMapping);
    }
  });
}

export function getPrimaryColor(
  color: string,
  colorClassMapping: any
): { fill: string; stroke: string } {
  const lowerColor = color.toLowerCase();
  const colorName = Object.keys(colorClassMapping).find(name => lowerColor.includes(name.toLowerCase()));
  return colorClassMapping[colorName || 'default'];
}
