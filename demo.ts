export namespace Hz.Http {
 
  const ES6Promise = require('es6-promise');
 
  export interface DatasObject {
    [data: string]: number | string | string[] | undefined;
  }
 
  export interface HeadersObject {
    [header: string]: number | string | string[] | undefined;
  }
 
  export interface RequestParams {
    url: string;
    method?: string;
    dataType?: string;
    data?: string | DatasObject | ArrayBuffer;
    header?: HeadersObject;
    responseType?: string;
  }
 
  export class HttpError extends Error {
 
    public statusCode: number;
    public header: HeadersObject;
    public body: string | object | ArrayBuffer;
 
    constructor(statusCode: number, header: HeadersObject, body: string | object | ArrayBuffer) {
      super(`response status code: ${statusCode}`);
      this.statusCode = statusCode;
      this.header = header;
      this.body = body;
    }
  }
 
  export class ResponsePromise<T> extends ES6Promise<T> {
 
    public statusCode: number;
    public header: HeadersObject;
    public body: string | object | ArrayBuffer;
 
    public requestTask: WechatMiniprogram.RequestTask;
 
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
      super(executor);
    }
 
    public onHeadersReceived(callback: WechatMiniprogram.RequestTaskOnHeadersReceivedCallback) {
      this.requestTask.onHeadersReceived(callback);
    }
 
    public offHeadersReceived(callback: WechatMiniprogram.RequestTaskOffHeadersReceivedCallback) {
      this.requestTask.offHeadersReceived(callback);
    }
 
    public abort(): void {
      this.requestTask.abort();
    }
  }
 
  export class Request {
 
    public static ExecAsync<T>(pars: RequestParams): ResponsePromise<T> {
 
      var requestTask: WechatMiniprogram.RequestTask;
 
      var p = new ResponsePromise<T>((resolve, reject) => {
 
        try {
          requestTask = wx.request({
            url: pars.url,
            data: pars.data,
            header: pars.header,
            method: pars.method,
            dataType: pars.dataType,
            responseType: pars.responseType,
            success(res) {
 
              if (res.statusCode >= 200 && res.statusCode < 300) {
 
                p.statusCode = res.statusCode;
                p.header = res.header;
                p.body = res.data;
 
                resolve(res.data);
              }
              else {
                reject(new HttpError(res.statusCode, res.header, res.data));
              }
 
            },
            fail(err) {
              reject(new Error(err.errMsg));
            }
          });
        }
        catch (e) {
          reject(e);
        }
 
      });
 
      p.requestTask = requestTask;
      return p;
    }
 
    public static getAsync<T>(url: string, data?: string | DatasObject | ArrayBuffer, header?: HeadersObject): ResponsePromise<T> {
      return Request.ExecAsync<T>({ url: url, data: data, header: header, method:"GET" });
    }
 
    public static postAsync<T>(url: string, data?: string | DatasObject | ArrayBuffer, header?: HeadersObject): ResponsePromise<T> {
      return Request.ExecAsync<T>({ url: url, data: data, header: header, method:"POST" });
    }
 
    public static deleteAsync<T>(url: string, data?: string | DatasObject | ArrayBuffer, header?: HeadersObject): ResponsePromise<T> {
      return Request.ExecAsync<T>({ url: url, data: data, header: header, method:"DELETE" });
    }
  }
}