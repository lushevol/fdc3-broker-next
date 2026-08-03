import { TemplateResult } from 'lit';
import { CalendarMetadata } from './ScCalendar.js';

export function processCalendarMetadata(
  calendars: (string | CalendarMetadata)[],
  metadataMap: Map<string, CalendarMetadata>
): void {
  metadataMap.clear();
  
  calendars.forEach(calendar => {
    if (typeof calendar === 'string') {
      const [source, name] = calendar.split('-');
      const key = calendar;
      metadataMap.set(key, {
        id: calendar,
        name: name || source,
        source,
      });
    } else {
      let source = calendar.source;
      
      if (!source && calendar.owner?.address) {
        const emailDomain = calendar.owner.address.split('@')[1]?.split('.')[0];
        source = emailDomain ? emailDomain.charAt(0).toUpperCase() + emailDomain.slice(1) : undefined;
      }
      if (!source) {
        source = 'Calendar';
      }
      
      const key = `${source}-${calendar.name}`;
      metadataMap.set(key, { ...calendar, source });
    }
  });
}

export function getCalendarKeys(
  metadataMap: Map<string, CalendarMetadata>
): string[] {
  return Array.from(metadataMap.keys());
}

export function getEditableCalendars(
  metadataMap: Map<string, CalendarMetadata>
): { label: string; value: string; metadata?: CalendarMetadata }[] {
  const editableCalendars: { label: string; value: string; metadata?: CalendarMetadata }[] = [];
  
  metadataMap.forEach((metadata, key) => {
    if (metadata.canEdit !== false) {
      editableCalendars.push({
        label: metadata.name,
        value: key,
        metadata,
      });
    }
  });
  
  return editableCalendars;
}

export function buildCalendarList(
  calendarKeys: string[],
  metadataMap: Map<string, CalendarMetadata>,
  selectedCalendars: Set<string>,
  colorMapping: any,
  renderPrefix: (
    fillColor: string, 
    strokeColor: string, 
    calendarKey: string, 
    isChecked: boolean
  ) => TemplateResult,
  renderSuffix: (calendarKey: string) => TemplateResult
): any[] {
  if (calendarKeys.length === 0) {
    return [];
  }

  const groupedItems: { [key: string]: { key: string; title: string; metadata?: CalendarMetadata }[] } = {};

  calendarKeys.forEach(key => {
    const metadata = metadataMap.get(key);
    const sourceDisplayName = metadata?.sourceDisplayName || metadata?.source || key.split('-')[0];
    const name = metadata?.name || key.split('-')[1] || sourceDisplayName;
    const id = metadata?.id || key;

    if (!groupedItems[sourceDisplayName]) {
      groupedItems[sourceDisplayName] = [];
    }
    groupedItems[sourceDisplayName].push({
      key: id,
      title: name,
      metadata,
    });
  });

  return Object.keys(groupedItems).map(sourceDisplayName => {
    const children = groupedItems[sourceDisplayName].map(child => {
      const name = child.metadata?.name || child.title;
      const color = colorMapping[name]?.fill || 'inherit';
      const strokeColor = colorMapping[name]?.stroke || 'inherit';
      const isChecked = selectedCalendars.has(child.key);

      return {
        key: child.key,
        title: child.title,
        metadata: child.metadata,
        prefix: renderPrefix(color, strokeColor, child.key, isChecked),
        suffix: renderSuffix(child.key),
      };
    });

    return {
      key: sourceDisplayName,
      title: sourceDisplayName,
      children,
      open: true,
    };
  });
}

export function updateCalendarListSuffixes(
  calendarList: any[],
  selectedCalendars: Set<string>,
  metadataMap: Map<string, CalendarMetadata>,
  colorMapping: any,
  renderPrefix: (
    fillColor: string, 
    strokeColor: string, 
    calendarKey: string, 
    isChecked: boolean
  ) => TemplateResult,
  renderSuffix: (calendarKey: string) => TemplateResult
): any[] {
  return calendarList.map(sourceItem => {
    const updatedChildren = sourceItem.children.map((child: any) => {
      const isChecked = selectedCalendars.has(child.key);
      
      // Use metadata name for color lookup (key is now calendar id)
      const name = child.metadata?.name;
      const fillColor = colorMapping[name]?.fill || 'inherit';
      const strokeColor = colorMapping[name]?.stroke || 'inherit';
      
      return {
        ...child,
        prefix: renderPrefix(fillColor, strokeColor, child.key, isChecked),
        suffix: renderSuffix(child.key),
      };
    });

    return {
      ...sourceItem,
      children: updatedChildren,
    };
  });
}

export function getInitialSelectedCalendars(
  availableCalendars: (string | CalendarMetadata)[],
  currentSelection: (string | CalendarMetadata)[]
): (string | CalendarMetadata)[] {
  if (!currentSelection || currentSelection.length === 0) {
    const first = availableCalendars[0];
    return first !== undefined ? [first] : [];
  }
  return currentSelection;
}
