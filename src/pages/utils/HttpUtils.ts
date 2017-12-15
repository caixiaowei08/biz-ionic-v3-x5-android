import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class HttpUtils{
  /*请求域名设置*/
  baseUrl: string = "http://contact.app.baitizhan.com";

  constructor(private http: Http) {
  }

  HttpGet(url, callback) {
    this.http.get(this.baseUrl + url).subscribe((data) => {
      callback(data.json());
    }, (error) => {
      callback(null);
    })
  }

  HttpPost(url, body, callback) {
    this.http.post(this.baseUrl + url, body).subscribe((data) => {
      callback(data.json());
    }, (error) => {
      callback(null);
    })
  }

}
