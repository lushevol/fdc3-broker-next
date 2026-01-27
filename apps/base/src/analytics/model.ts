export type AnalyticsKeyType = 'tile' | 'modal' | 'tab' | 'button' | 'dropdown' | 'switch';
export type AnalyticsTileOrModalEventType = 'open' | 'close';
export type AnalyticsButtonOrTabOrSwitchEventType = 'click';
export type AnalyticsDropDownEventType = 'select';

export interface AnalyticsType {
  singleUIAuthorization?: string;
  key: AnalyticsKeyType;
  event:
    | AnalyticsTileOrModalEventType
    | AnalyticsButtonOrTabOrSwitchEventType
    | AnalyticsDropDownEventType;
  container: string;
  tile: string;
  name?: string;
  value?: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;
  attribute6?: string;
  attribute7?: string;
  attribute8?: string;
  attribute9?: string;
  attribute10?: string;
  attribute11?: string;
  attribute12?: string;
  attribute13?: string;
  attribute14?: string;
  attribute15?: string;
  attribute16?: string;
  attribute17?: string;
  attribute18?: string;
  attribute19?: string;
  attribute20?: string;
}

export interface AnalyticsData {
  container: string;
  tile: string;
  name?: string;
  value?: string;
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;
  attribute6?: string;
  attribute7?: string;
  attribute8?: string;
  attribute9?: string;
  attribute10?: string;
  attribute11?: string;
  attribute12?: string;
  attribute13?: string;
  attribute14?: string;
  attribute15?: string;
  attribute16?: string;
  attribute17?: string;
  attribute18?: string;
  attribute19?: string;
  attribute20?: string;
}
