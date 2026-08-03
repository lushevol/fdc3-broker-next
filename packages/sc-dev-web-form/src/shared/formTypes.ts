export interface ValueChangeFunction {
  (e: CustomEvent, type: string): any;
} 

export interface CustomEventCallback {
  (e: CustomEvent): any;
} 

export interface ValueChangeCallback {
  (v: any): any;
}

export interface CommentsChangeFunction {
  (e: CustomEvent): any;
} 

export interface CommentsChangeCallback {
  (v: any): any;
}