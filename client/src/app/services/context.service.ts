import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private data: any = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData<T>(key: string): T {
    return this.data[key];
  }

  clearData(key: string) {
    delete this.data[key];
  }

  getAllData() {
    return this.data;
  }
}
