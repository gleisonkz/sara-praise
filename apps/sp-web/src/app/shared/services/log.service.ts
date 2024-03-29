import { HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private readonly METHOD_COLORS = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2',
  };

  private readonly URI_STYLES = `
  font-size: 10px;
  color: #E36EEC;
  `;

  private readonly DATE_STYLES = `
  font-size: 9px;
  color: #8893EA;
  `;

  private buildHttpLogStyle(method: HttpMethod) {
    const fontColor = '#fff';
    const bgColor = this.METHOD_COLORS[method];
    const styles = `
    font-size: 9px;
    border-radius: 3px;
    font-family: sans-serif;
    color:${fontColor};
    font-weight:bold;
    background-color:${bgColor};
    padding: 3px 6px`;

    return styles;
  }

  logHttp<TResponse, TPayload>(
    path: string,
    payload: TPayload,
    responseData: TResponse,
    httpMethod: HttpMethod,
    headers: HttpHeaders
  ) {
    if (!isDevMode()) return;

    const methodStyle = this.buildHttpLogStyle(httpMethod);
    const method = `%c${httpMethod.toUpperCase()}`;
    const date = new Date();

    console.groupCollapsed(method + `%c ${path}` + ` %c${date}`, methodStyle, this.URI_STYLES, this.DATE_STYLES);

    console.groupCollapsed('%cHeaders', this.URI_STYLES);
    console.info(headers);
    console.groupEnd();

    console.groupCollapsed('%cPayload', this.URI_STYLES);
    console.info(payload);
    console.groupEnd();

    console.group('%cResponse Data', this.URI_STYLES);
    console.info(responseData);
    console.groupEnd();

    console.groupEnd();
  }
}
