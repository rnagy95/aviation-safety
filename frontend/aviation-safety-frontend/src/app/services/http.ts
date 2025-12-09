import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Http {
  private baseUrl = 'http://localhost:8000/';

  constructor(private httpClient: HttpClient) {
  }

  get<T>(endpoint: string, params: Object): Observable<T | undefined>{
    let url = this.baseUrl + endpoint;
    for (const [key, value] of Object.entries(params)) {
      url += (url.includes('?') ? '&' : '?') + `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return this.httpClient.get<T>(url);
  }

}
